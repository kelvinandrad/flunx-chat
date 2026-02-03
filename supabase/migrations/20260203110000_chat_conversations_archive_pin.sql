-- Fase C: Archive e Pin em conversas (PLANO-CONVERSAS-UX-E-GRUPOS.md)
-- is_archived: conversa arquivada no WhatsApp
-- is_pinned: conversa fixada

ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_chat_conversations_archived
  ON public.chat_conversations(inbox_id, is_archived)
  WHERE is_archived = true;

CREATE INDEX IF NOT EXISTS idx_chat_conversations_pinned
  ON public.chat_conversations(inbox_id, is_pinned)
  WHERE is_pinned = true;

COMMENT ON COLUMN public.chat_conversations.is_archived IS 'Conversa arquivada (ex.: do WhatsApp)';
COMMENT ON COLUMN public.chat_conversations.is_pinned IS 'Conversa fixada';
