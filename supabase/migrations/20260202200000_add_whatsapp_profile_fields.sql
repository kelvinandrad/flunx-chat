-- Migration: Add WhatsApp profile fields to chat_inboxes
-- Date: 2026-02-02
-- Description: Adds columns to store WhatsApp profile data (name, photo, phone number)

-- Add WhatsApp profile columns
ALTER TABLE chat_inboxes ADD COLUMN IF NOT EXISTS whatsapp_profile_name TEXT;
ALTER TABLE chat_inboxes ADD COLUMN IF NOT EXISTS whatsapp_profile_pic_url TEXT;
ALTER TABLE chat_inboxes ADD COLUMN IF NOT EXISTS whatsapp_phone_number TEXT;
ALTER TABLE chat_inboxes ADD COLUMN IF NOT EXISTS whatsapp_jid TEXT;

-- Add contact and conversation counts (synced from Evolution)
ALTER TABLE chat_inboxes ADD COLUMN IF NOT EXISTS contacts_count INTEGER DEFAULT 0;
ALTER TABLE chat_inboxes ADD COLUMN IF NOT EXISTS conversations_count INTEGER DEFAULT 0;

-- Comment on new columns
COMMENT ON COLUMN chat_inboxes.whatsapp_profile_name IS 'Nome do perfil no WhatsApp';
COMMENT ON COLUMN chat_inboxes.whatsapp_profile_pic_url IS 'URL da foto de perfil do WhatsApp';
COMMENT ON COLUMN chat_inboxes.whatsapp_phone_number IS 'Número de telefone formatado (ex: (62) 99928-8205)';
COMMENT ON COLUMN chat_inboxes.whatsapp_jid IS 'JID completo do WhatsApp (ex: 5562999288205@s.whatsapp.net)';
COMMENT ON COLUMN chat_inboxes.contacts_count IS 'Quantidade de contatos sincronizados';
COMMENT ON COLUMN chat_inboxes.conversations_count IS 'Quantidade de conversas';
