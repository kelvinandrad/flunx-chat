-- Migration: Alinhar schema ao uso flunx-chat + flunx-channels-api (Evolution)
-- Data: 2026-02-03
-- Objetivo: permitir um contato por (inbox, remote_jid), FK inbox em contacts, message_type em messages

-- 1) chat_contacts: limpar inbox_id órfãos (inbox deletado) e depois FK -> chat_inboxes
UPDATE public.chat_contacts c
SET inbox_id = NULL
WHERE c.inbox_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.chat_inboxes i WHERE i.id = c.inbox_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chat_contacts_inbox_id_fkey'
    AND conrelid = 'public.chat_contacts'::regclass
  ) THEN
    ALTER TABLE public.chat_contacts
      ADD CONSTRAINT chat_contacts_inbox_id_fkey
      FOREIGN KEY (inbox_id) REFERENCES public.chat_inboxes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2) chat_contacts: trocar unicidade de (organization_id, source_id) por (inbox_id, remote_jid)
--    para permitir o mesmo número em inboxes diferentes (Evolution: um contato por canal por número)
ALTER TABLE public.chat_contacts
  DROP CONSTRAINT IF EXISTS chat_contacts_organization_id_source_id_key;

-- Remover duplicatas (inbox_id, remote_jid) mantendo a linha com id menor
DELETE FROM public.chat_contacts a
USING public.chat_contacts b
WHERE a.inbox_id IS NOT NULL AND a.remote_jid IS NOT NULL
  AND b.inbox_id IS NOT NULL AND b.remote_jid IS NOT NULL
  AND a.inbox_id = b.inbox_id AND a.remote_jid = b.remote_jid
  AND a.id > b.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_contacts_inbox_remote_jid_unique
  ON public.chat_contacts(inbox_id, remote_jid)
  WHERE inbox_id IS NOT NULL AND remote_jid IS NOT NULL;

-- 3) chat_messages: coluna message_type (API e webhook usam)
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text';

COMMENT ON COLUMN public.chat_messages.message_type IS 'Tipo da mensagem: text, image, audio, etc. (Evolution)';
