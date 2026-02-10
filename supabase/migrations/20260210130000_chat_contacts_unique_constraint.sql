-- Constraint UNIQUE explícita para (inbox_id, remote_jid).
-- PostgREST/Supabase upsert pode exigir constraint, não só índice único.
-- Idempotente.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chat_contacts_inbox_remote_jid_key'
    AND conrelid = 'public.chat_contacts'::regclass
  ) THEN
    ALTER TABLE public.chat_contacts
      ADD CONSTRAINT chat_contacts_inbox_remote_jid_key
      UNIQUE (inbox_id, remote_jid);
  END IF;
END $$;
