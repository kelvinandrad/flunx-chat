-- Limpa todos os dados de chat: mensagens, conversas, contatos e instâncias (inboxes).
-- CASCADE resolve FKs entre as tabelas em um único comando.

TRUNCATE TABLE
  public.chat_messages,
  public.chat_scheduled_messages,
  public.chat_contact_notes,
  public.chat_proposals,
  public.chat_reminders,
  public.chat_conversations,
  public.chat_contacts,
  public.chat_inboxes
RESTART IDENTITY
CASCADE;
