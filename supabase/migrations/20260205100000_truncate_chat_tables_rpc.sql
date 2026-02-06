-- Função para esvaziar tabelas de chat (uso administrativo / scripts).
-- Chamar via: supabase.rpc('truncate_chat_tables')
CREATE OR REPLACE FUNCTION public.truncate_chat_tables()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  TRUNCATE TABLE
    chat_messages,
    chat_scheduled_messages,
    chat_conversations,
    chat_contact_notes,
    chat_proposals,
    chat_contact_inboxes,
    chat_contacts;
$$;
