-- Limpa todos os dados de chat: mensagens, conversas, contatos e instâncias (inboxes).
-- CASCADE permite truncar em qualquer ordem (FKs resolvidas pelo Postgres).

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
