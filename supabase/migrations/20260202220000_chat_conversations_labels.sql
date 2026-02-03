-- Fase D4: Etiquetas internas em conversas (labels TEXT[]).
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';
