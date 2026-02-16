-- Conferir e criar (se não existir) a constraint UNIQUE(evolution_message_id) em chat_messages.
-- Cole no Supabase Dashboard → SQL Editor e execute.
-- Isso evita o erro 42P10 no webhook de mensagens da API.

-- 1) Verificar se a constraint já existe (apenas consulta):
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'public.chat_messages'::regclass
  AND conname = 'chat_messages_evolution_message_id_key';

-- 2) Criar a constraint somente se não existir (idempotente):
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
    RAISE NOTICE 'Constraint chat_messages_evolution_message_id_key criada.';
  ELSE
    RAISE NOTICE 'Constraint chat_messages_evolution_message_id_key já existe.';
  END IF;
END $$;
