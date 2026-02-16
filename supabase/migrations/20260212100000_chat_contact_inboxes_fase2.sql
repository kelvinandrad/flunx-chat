-- Fase 2: Modelo Contact + ContactInbox (estilo Chatwoot).
-- Contato = identidade por organização; contact_inbox = vínculo inbox com source_id.
-- Migra dados da tabela atual chat_contacts (uma linha por inbox+remote_jid) para
-- chat_contacts (por organização) + chat_contact_inboxes (por inbox+source_id).

-- 1) Criar tabela de contatos por organização (nome temporário para migração)
CREATE TABLE IF NOT EXISTS public.chat_contacts_org (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  identifier TEXT NOT NULL,
  phone_number TEXT,
  name TEXT,
  avatar_url TEXT,
  custom_attributes JSONB,
  contact_type TEXT DEFAULT 'individual' CHECK (contact_type IN ('individual', 'group')),
  whatsapp_profile_name TEXT,
  whatsapp_profile_pic_url TEXT,
  business_profile JSONB,
  business_profile_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, identifier)
);

CREATE INDEX IF NOT EXISTS idx_chat_contacts_org_organization
  ON public.chat_contacts_org(organization_id);

-- 2) Criar tabela contact_inboxes (inbox + contact + source_id)
CREATE TABLE IF NOT EXISTS public.chat_contact_inboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inbox_id UUID NOT NULL REFERENCES public.chat_inboxes(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.chat_contacts_org(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(inbox_id, source_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_contact_inboxes_inbox
  ON public.chat_contact_inboxes(inbox_id);
CREATE INDEX IF NOT EXISTS idx_chat_contact_inboxes_contact
  ON public.chat_contact_inboxes(contact_id);

-- 3) Migrar dados: para cada (organization_id, identifier=remote_jid) criar contact; para cada (inbox_id, contact_id, source_id) criar contact_inbox
INSERT INTO public.chat_contacts_org (
  organization_id, identifier, phone_number, name, avatar_url, contact_type,
  whatsapp_profile_name, whatsapp_profile_pic_url, business_profile, business_profile_fetched_at
)
SELECT
  organization_id,
  remote_jid,
  NULL,
  name,
  whatsapp_profile_pic_url,
  COALESCE(contact_type, 'individual'),
  whatsapp_profile_name,
  whatsapp_profile_pic_url,
  business_profile,
  business_profile_fetched_at
FROM public.chat_contacts
WHERE organization_id IS NOT NULL AND remote_jid IS NOT NULL
ON CONFLICT (organization_id, identifier) DO UPDATE SET
  name = COALESCE(EXCLUDED.name, chat_contacts_org.name),
  whatsapp_profile_name = COALESCE(EXCLUDED.whatsapp_profile_name, chat_contacts_org.whatsapp_profile_name),
  whatsapp_profile_pic_url = COALESCE(EXCLUDED.whatsapp_profile_pic_url, chat_contacts_org.whatsapp_profile_pic_url),
  business_profile = COALESCE(EXCLUDED.business_profile, chat_contacts_org.business_profile),
  business_profile_fetched_at = COALESCE(EXCLUDED.business_profile_fetched_at, chat_contacts_org.business_profile_fetched_at),
  updated_at = now();

-- 4) Inserir contact_inboxes: uma por linha antiga de chat_contacts, ligando ao contact_org
INSERT INTO public.chat_contact_inboxes (inbox_id, contact_id, source_id)
SELECT
  c.inbox_id,
  co.id,
  c.remote_jid
FROM public.chat_contacts c
JOIN public.chat_contacts_org co ON co.organization_id = c.organization_id AND co.identifier = c.remote_jid
WHERE c.inbox_id IS NOT NULL AND c.remote_jid IS NOT NULL
ON CONFLICT (inbox_id, source_id) DO NOTHING;

-- 5) Adicionar contact_inbox_id em chat_conversations e preencher
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS contact_inbox_id UUID;

UPDATE public.chat_conversations conv
SET contact_inbox_id = cbi.id
FROM public.chat_contact_inboxes cbi
JOIN public.chat_contacts old ON old.inbox_id = cbi.inbox_id AND old.remote_jid = cbi.source_id
WHERE conv.inbox_id = old.inbox_id AND conv.contact_id = old.id
  AND conv.contact_inbox_id IS NULL;

-- 6) Atualizar contact_id das conversas para o novo contact (org-level)
UPDATE public.chat_conversations conv
SET contact_id = cbi.contact_id
FROM public.chat_contact_inboxes cbi
WHERE conv.contact_inbox_id = cbi.id
  AND (conv.contact_id IS DISTINCT FROM cbi.contact_id);

-- 6b) Atualizar outras tabelas que referenciam chat_contacts (contact_id antigo -> novo)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_contact_notes') THEN
    UPDATE public.chat_contact_notes n SET contact_id = sub.new_id
    FROM (SELECT old.id AS old_id, cbi.contact_id AS new_id FROM public.chat_contact_inboxes cbi JOIN public.chat_contacts old ON old.inbox_id = cbi.inbox_id AND old.remote_jid = cbi.source_id) sub
    WHERE n.contact_id = sub.old_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_proposals') THEN
    UPDATE public.chat_proposals p SET contact_id = sub.new_id FROM (SELECT old.id AS old_id, cbi.contact_id AS new_id FROM public.chat_contact_inboxes cbi JOIN public.chat_contacts old ON old.inbox_id = cbi.inbox_id AND old.remote_jid = cbi.source_id) sub WHERE p.contact_id = sub.old_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_scheduled_messages') THEN
    UPDATE public.chat_scheduled_messages s SET contact_id = sub.new_id FROM (SELECT old.id AS old_id, cbi.contact_id AS new_id FROM public.chat_contact_inboxes cbi JOIN public.chat_contacts old ON old.inbox_id = cbi.inbox_id AND old.remote_jid = cbi.source_id) sub WHERE s.contact_id = sub.old_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_reminders') THEN
    UPDATE public.chat_reminders r SET contact_id = sub.new_id FROM (SELECT old.id AS old_id, cbi.contact_id AS new_id FROM public.chat_contact_inboxes cbi JOIN public.chat_contacts old ON old.inbox_id = cbi.inbox_id AND old.remote_jid = cbi.source_id) sub WHERE r.contact_id = sub.old_id;
  END IF;
END $$;

-- 7) Remover FK antiga de conversas -> chat_contacts
DO $$
DECLARE
  cname TEXT;
BEGIN
  SELECT con.conname INTO cname
  FROM pg_constraint con
  JOIN pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = ANY(con.conkey) AND a.attname = 'contact_id' AND NOT a.attisdropped
  WHERE con.conrelid = 'public.chat_conversations'::regclass AND con.contype = 'f';
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.chat_conversations DROP CONSTRAINT %I', cname);
  END IF;
END $$;

-- 8) Trocar tabelas: renomear antiga, renomear org para chat_contacts
ALTER TABLE public.chat_contacts RENAME TO chat_contacts_old;
ALTER TABLE public.chat_contacts_org RENAME TO chat_contacts;

-- 9) FK contact_inboxes.contact_id já aponta para chat_contacts_org que agora é chat_contacts (por rename)
-- Adicionar FK conversas.contact_id -> chat_contacts e conversas.contact_inbox_id -> chat_contact_inboxes
ALTER TABLE public.chat_conversations
  ADD CONSTRAINT chat_conversations_contact_id_fkey
  FOREIGN KEY (contact_id) REFERENCES public.chat_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.chat_conversations
  ADD CONSTRAINT chat_conversations_contact_inbox_id_fkey
  FOREIGN KEY (contact_inbox_id) REFERENCES public.chat_contact_inboxes(id) ON DELETE CASCADE;

-- 10) Remover UNIQUE antigo (inbox_id, contact_id) pois contact_id agora é org-level e pode repetir por inbox em teoria; na Fase 2 mantemos uma conversa por (inbox_id, contact_inbox_id)
ALTER TABLE public.chat_conversations
  DROP CONSTRAINT IF EXISTS chat_conversations_inbox_contact_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_conversations_inbox_contact_inbox
  ON public.chat_conversations(inbox_id, contact_inbox_id)
  WHERE inbox_id IS NOT NULL AND contact_inbox_id IS NOT NULL;

-- 11) Remover todas as FKs que referenciam chat_contacts_old (notes, proposals, scheduled_messages, reminders, e em alguns ambientes contact_inboxes), depois dropar a tabela.
DO $$
DECLARE
  r RECORD;
  old_oid OID;
BEGIN
  SELECT oid INTO old_oid FROM pg_class WHERE relnamespace = 'public'::regnamespace AND relname = 'chat_contacts_old';
  IF old_oid IS NULL THEN
    RETURN; -- tabela já não existe
  END IF;
  FOR r IN
    SELECT c.conname AS constraint_name, c.conrelid::regclass AS table_name
    FROM pg_constraint c
    WHERE c.contype = 'f' AND c.confrelid = old_oid
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I', r.table_name, r.constraint_name);
  END LOOP;
END $$;

DROP TABLE IF EXISTS public.chat_contacts_old;

-- 11b) Recriar FKs das tabelas auxiliares para a nova chat_contacts (os contact_id já foram migrados no passo 6b).
ALTER TABLE public.chat_contact_notes
  DROP CONSTRAINT IF EXISTS chat_contact_notes_contact_id_fkey;
ALTER TABLE public.chat_contact_notes
  ADD CONSTRAINT chat_contact_notes_contact_id_fkey
  FOREIGN KEY (contact_id) REFERENCES public.chat_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.chat_proposals
  DROP CONSTRAINT IF EXISTS chat_proposals_contact_id_fkey;
ALTER TABLE public.chat_proposals
  ADD CONSTRAINT chat_proposals_contact_id_fkey
  FOREIGN KEY (contact_id) REFERENCES public.chat_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.chat_scheduled_messages
  DROP CONSTRAINT IF EXISTS chat_scheduled_messages_contact_id_fkey;
ALTER TABLE public.chat_scheduled_messages
  ADD CONSTRAINT chat_scheduled_messages_contact_id_fkey
  FOREIGN KEY (contact_id) REFERENCES public.chat_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.chat_reminders
  DROP CONSTRAINT IF EXISTS chat_reminders_contact_id_fkey;
ALTER TABLE public.chat_reminders
  ADD CONSTRAINT chat_reminders_contact_id_fkey
  FOREIGN KEY (contact_id) REFERENCES public.chat_contacts(id) ON DELETE CASCADE;

-- contact_inboxes: se a FK foi dropada (ex.: referenciou chat_contacts antes do rename), religar à nova chat_contacts
ALTER TABLE public.chat_contact_inboxes
  DROP CONSTRAINT IF EXISTS chat_contact_inboxes_contact_id_fkey;
ALTER TABLE public.chat_contact_inboxes
  ADD CONSTRAINT chat_contact_inboxes_contact_id_fkey
  FOREIGN KEY (contact_id) REFERENCES public.chat_contacts(id) ON DELETE CASCADE;

-- 12) RLS: políticas para chat_contacts e chat_contact_inboxes (ler via organization/inbox)
-- Se já existir RLS em chat_contacts, foi dropado com a tabela; recriar para a nova chat_contacts.
ALTER TABLE public.chat_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_contact_inboxes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS chat_contacts_org_select ON public.chat_contacts;
CREATE POLICY chat_contacts_org_select ON public.chat_contacts
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS chat_contact_inboxes_select ON public.chat_contact_inboxes;
CREATE POLICY chat_contact_inboxes_select ON public.chat_contact_inboxes
  FOR SELECT USING (
    inbox_id IN (SELECT id FROM public.chat_inboxes WHERE organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()))
  );

COMMENT ON TABLE public.chat_contacts IS 'Contato por organização (identifier = ex.: remoteJid). Fase 2 estilo Chatwoot.';
COMMENT ON TABLE public.chat_contact_inboxes IS 'Vínculo contato-inbox com source_id único por inbox.';
COMMENT ON COLUMN public.chat_contacts.identifier IS 'Identificador do contato no canal (ex.: remoteJid 5562...@s.whatsapp.net)';
COMMENT ON COLUMN public.chat_contact_inboxes.source_id IS 'ID do contato no canal (ex.: remoteJid); único por inbox.';
