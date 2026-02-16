-- Garantir coluna updated_at em chat_contact_inboxes (evita PGRST204 no upsert da API).
-- Execute no SQL Editor se o cache do PostgREST não reconhecer a coluna; depois recarregue o schema (Project Settings → API).

ALTER TABLE public.chat_contact_inboxes
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

COMMENT ON COLUMN public.chat_contact_inboxes.updated_at IS 'Atualizado na criação; API não envia no upsert para evitar PGRST204.';
