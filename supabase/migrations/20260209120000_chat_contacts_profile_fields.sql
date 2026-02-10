-- Fase 0: Campos de perfil WhatsApp em chat_contacts para enriquecimento (Fase 4).
-- Evolution findContacts/fetchProfile retornam name e picture; persistir aqui.

ALTER TABLE public.chat_contacts
  ADD COLUMN IF NOT EXISTS whatsapp_profile_name TEXT;

ALTER TABLE public.chat_contacts
  ADD COLUMN IF NOT EXISTS whatsapp_profile_pic_url TEXT;

COMMENT ON COLUMN public.chat_contacts.whatsapp_profile_name IS 'Nome do perfil no WhatsApp (enriquecido por Evolution)';
COMMENT ON COLUMN public.chat_contacts.whatsapp_profile_pic_url IS 'URL da foto de perfil do WhatsApp (enriquecido por Evolution)';
