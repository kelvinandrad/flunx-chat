-- F2.6: Persistir perfil comercial (WhatsApp Business) em chat_contacts.
-- Preenchido quando GET business-profile obtém dados da Evolution; usado como cache em falhas.

ALTER TABLE public.chat_contacts
  ADD COLUMN IF NOT EXISTS business_profile JSONB;

ALTER TABLE public.chat_contacts
  ADD COLUMN IF NOT EXISTS business_profile_fetched_at TIMESTAMPTZ;

COMMENT ON COLUMN public.chat_contacts.business_profile IS 'Perfil comercial WhatsApp Business (descrição, site, horário, etc.) – preenchido ao buscar na Evolution';
COMMENT ON COLUMN public.chat_contacts.business_profile_fetched_at IS 'Data da última busca bem-sucedida do business profile na Evolution';
