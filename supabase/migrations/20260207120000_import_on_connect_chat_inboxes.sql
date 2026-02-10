-- Migration: Import on connect (Evolution → Flunx igual ao Chatwoot)
-- Date: 2026-02-07
-- Description: Config por inbox para importar contatos e mensagens automaticamente após conexão

ALTER TABLE public.chat_inboxes ADD COLUMN IF NOT EXISTS import_contacts_on_connect BOOLEAN DEFAULT false;
ALTER TABLE public.chat_inboxes ADD COLUMN IF NOT EXISTS import_messages_on_connect BOOLEAN DEFAULT false;
ALTER TABLE public.chat_inboxes ADD COLUMN IF NOT EXISTS import_messages_days INTEGER DEFAULT 3;

ALTER TABLE public.chat_inboxes ADD CONSTRAINT chk_import_messages_days
  CHECK (import_messages_days >= 0 AND import_messages_days <= 30);

COMMENT ON COLUMN public.chat_inboxes.import_contacts_on_connect IS 'Se true, ao conectar a Evolution importa contatos automaticamente (estilo Chatwoot)';
COMMENT ON COLUMN public.chat_inboxes.import_messages_on_connect IS 'Se true, ao conectar importa histórico de mensagens (últimos import_messages_days dias)';
COMMENT ON COLUMN public.chat_inboxes.import_messages_days IS 'Dias de histórico a importar ao conectar (0 = só contatos). Entre 0 e 30';
