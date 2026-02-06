-- Todas as tabelas da cadeia de FK (mensagens → conversas/contatos) no mesmo comando
TRUNCATE TABLE
  public.chat_messages,
  public.chat_scheduled_messages,
  public.chat_conversations,
  public.chat_contact_notes,
  public.chat_proposals,
  public.chat_contact_inboxes,
  public.chat_contacts;
