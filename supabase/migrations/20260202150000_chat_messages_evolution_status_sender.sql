-- Fase 2: alinhar chat_messages ao uso Evolution (API + webhook).
-- Schema real (dump remoto): status CHECK (sending, sent, delivered, read, failed);
-- API/webhook usam status 'received' e 'pending_send'. sender_type NOT NULL (contact/agent).
-- Esta migration estende o CHECK de status e define default para sender_type.

-- 1) Estender status para aceitar 'received' e 'pending_send'
ALTER TABLE public.chat_messages
  DROP CONSTRAINT IF EXISTS chat_messages_status_check;

ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_status_check CHECK (
    status = ANY (ARRAY[
      'sending'::text, 'sent'::text, 'delivered'::text, 'read'::text, 'failed'::text,
      'received'::text, 'pending_send'::text
    ])
  );

-- 2) Default para sender_type (webhook insere mensagens recebidas como 'contact')
ALTER TABLE public.chat_messages
  ALTER COLUMN sender_type SET DEFAULT 'contact';
