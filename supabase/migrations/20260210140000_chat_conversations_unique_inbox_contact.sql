-- Constraint UNIQUE em (inbox_id, contact_id) para chat_conversations.
-- Resolve 42P10 no upsert da API (onConflict: inbox_id, contact_id).
-- Idempotente.

-- Remover duplicatas mantendo a linha com id menor
DELETE FROM public.chat_conversations a
USING public.chat_conversations b
WHERE a.inbox_id IS NOT NULL AND a.contact_id IS NOT NULL
  AND b.inbox_id IS NOT NULL AND b.contact_id IS NOT NULL
  AND a.inbox_id = b.inbox_id AND a.contact_id = b.contact_id
  AND a.id > b.id;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chat_conversations_inbox_contact_id_key'
    AND conrelid = 'public.chat_conversations'::regclass
  ) THEN
    ALTER TABLE public.chat_conversations
      ADD CONSTRAINT chat_conversations_inbox_contact_id_key
      UNIQUE (inbox_id, contact_id);
  END IF;
END $$;
