/**
 * Tipos alinhados aos contratos da Fase 2 (flunx-channels-api).
 * Uso: listagem de conversas, mensagens e envio.
 * @see docs/FLUNX-CHAT-EVOLUTION-PLANO.md — Contratos da Fase 2
 */

export type ConversationContact = {
  id: string;
  name: string | null;
  remote_jid: string | null;
};

export type ConversationListItem = {
  id: string;
  contact: ConversationContact | null;
  preview: string | null;
  preview_at: string | null;
  status: string;
  updated_at: string;
};

export type ListConversationsResponse = {
  conversations: ConversationListItem[];
};

export type MessageListItem = {
  id: string;
  content: string;
  direction: "incoming" | "outgoing";
  message_type: string;
  status: string;
  created_at: string;
  evolution_message_id: string | null;
};

export type ListMessagesResponse = {
  messages: MessageListItem[];
  cursor: string | null; // created_at do último msg (mais antigo no array desc) para carregar mais
  has_more: boolean;
};

export type SendMessageBody = {
  content: string;
};

export type SendMessageResponse = MessageListItem & {
  status: "sent" | "failed";
  evolution_message_id?: string | null;
};
