-- Fase 3: Múltiplas conversas por (inbox, contact_inbox).
-- Remove UNIQUE(inbox_id, contact_inbox_id) para permitir várias threads (resolver/reabrir estilo Chatwoot).

-- 1) Remover índice único que impedia múltiplas conversas por contact_inbox
DROP INDEX IF EXISTS public.idx_chat_conversations_inbox_contact_inbox;

-- 2) Índice para listar "conversa ativa" ou últimas por contact_inbox (status, updated_at)
CREATE INDEX IF NOT EXISTS idx_chat_conversations_inbox_contact_inbox_updated
  ON public.chat_conversations(inbox_id, contact_inbox_id, updated_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_inbox_status_updated
  ON public.chat_conversations(inbox_id, status, updated_at DESC NULLS LAST);

COMMENT ON INDEX public.idx_chat_conversations_inbox_contact_inbox_updated IS 'Fase 3: listar conversas por contact_inbox (múltiplas threads); ordenação por updated_at';
