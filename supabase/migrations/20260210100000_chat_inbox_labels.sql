-- Etiquetas (labels) do WhatsApp recebidas via webhook Evolution (labels.edit).
-- Uma linha por etiqueta por canal; upsert por (inbox_id, evolution_label_id).
CREATE TABLE IF NOT EXISTS public.chat_inbox_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inbox_id UUID NOT NULL REFERENCES public.chat_inboxes(id) ON DELETE CASCADE,
  evolution_label_id TEXT NOT NULL,
  name TEXT,
  color INTEGER,
  deleted BOOLEAN DEFAULT false,
  predefined_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT uq_chat_inbox_labels_inbox_evolution_id UNIQUE (inbox_id, evolution_label_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_inbox_labels_inbox_id ON public.chat_inbox_labels(inbox_id);

COMMENT ON TABLE public.chat_inbox_labels IS 'Etiquetas do WhatsApp por canal, sincronizadas via webhook Evolution (labels.edit)';
COMMENT ON COLUMN public.chat_inbox_labels.evolution_label_id IS 'Id da etiqueta na Evolution (ex: 1, 2, 6, 8)';
COMMENT ON COLUMN public.chat_inbox_labels.name IS 'Nome da etiqueta (ex: Importante, Lead, Novo cliente)';
COMMENT ON COLUMN public.chat_inbox_labels.color IS 'Código de cor da Evolution (0-18)';
COMMENT ON COLUMN public.chat_inbox_labels.deleted IS 'Se a etiqueta foi excluída no WhatsApp';
COMMENT ON COLUMN public.chat_inbox_labels.predefined_id IS 'predefinedId da Evolution';
