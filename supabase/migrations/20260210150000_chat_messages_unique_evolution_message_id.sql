-- Constraint UNIQUE em evolution_message_id para chat_messages (upsert na API usa ON CONFLICT (evolution_message_id)).
-- Idempotente.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chat_messages_evolution_message_id_key'
    AND conrelid = 'public.chat_messages'::regclass
  ) THEN
    ALTER TABLE public.chat_messages
      ADD CONSTRAINT chat_messages_evolution_message_id_key
      UNIQUE (evolution_message_id);
  END IF;
END $$;
