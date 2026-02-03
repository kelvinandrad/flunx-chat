-- Fase B: Suporte a grupos (contact_type, participant_remote_jid).
-- contact_type: individual | group
-- participant_remote_jid: para mensagens em grupo, JID de quem enviou.

-- 1) chat_contacts.contact_type
ALTER TABLE public.chat_contacts
  ADD COLUMN IF NOT EXISTS contact_type TEXT DEFAULT 'individual';

ALTER TABLE public.chat_contacts
  DROP CONSTRAINT IF EXISTS chat_contacts_contact_type_check;

ALTER TABLE public.chat_contacts
  ADD CONSTRAINT chat_contacts_contact_type_check
  CHECK (contact_type IN ('individual', 'group'));

-- 2) chat_messages.participant_remote_jid (para grupos: quem enviou)
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS participant_remote_jid TEXT;
