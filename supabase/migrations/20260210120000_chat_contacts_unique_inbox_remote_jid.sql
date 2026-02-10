-- Garantir índice UNIQUE em (inbox_id, remote_jid) para chat_contacts.
-- Resolve erro 42P10 no upsert da API (ON CONFLICT specification).
-- Idempotente: pode rodar mesmo se o índice já existir.

-- Remover constraint antiga de unicidade, se existir (evita conflito)
ALTER TABLE public.chat_contacts
  DROP CONSTRAINT IF EXISTS chat_contacts_organization_id_source_id_key;

-- Remover duplicatas (inbox_id, remote_jid) mantendo a linha com id menor
DELETE FROM public.chat_contacts a
USING public.chat_contacts b
WHERE a.inbox_id IS NOT NULL AND a.remote_jid IS NOT NULL
  AND b.inbox_id IS NOT NULL AND b.remote_jid IS NOT NULL
  AND a.inbox_id = b.inbox_id AND a.remote_jid = b.remote_jid
  AND a.id > b.id;

-- Índice único exigido pelo upsert (onConflict: inbox_id, remote_jid)
CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_contacts_inbox_remote_jid_unique
  ON public.chat_contacts(inbox_id, remote_jid)
  WHERE inbox_id IS NOT NULL AND remote_jid IS NOT NULL;
