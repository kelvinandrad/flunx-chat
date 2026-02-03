/**
 * Tipos alinhados aos contratos da Fase 2 (flunx-channels-api).
 * Uso: listagem de conversas, mensagens e envio.
 * @see docs/FLUNX-CHAT-EVOLUTION-PLANO.md — Contratos da Fase 2
 */

export type ConversationContact = {
  id: string;
  name: string | null;
  remote_jid: string | null;
  contact_type?: "individual" | "group";
  avatar_url?: string | null;
};

export type ConversationListItem = {
  id: string;
  contact: ConversationContact | null;
  labels?: string[];
  preview: string | null;
  preview_at: string | null;
  status: string;
  updated_at: string;
};

export type ListConversationsParams = {
  limit?: number;
  days?: number;
  before?: string; // cursor: updated_at ISO para carregar mais
  only_with_messages?: boolean; // default true: só conversas com pelo menos uma mensagem
};

export type ContactListItem = {
  id: string;
  name: string | null;
  remote_jid: string | null;
  contact_type?: "individual" | "group";
  avatar_url?: string | null;
  updated_at: string;
};

export type ListContactsParams = {
  limit?: number;
  before?: string; // cursor: updated_at ISO
};

export type ListContactsResponse = {
  contacts: ContactListItem[];
  has_more: boolean;
  cursor: string | null;
};

export type ListConversationsResponse = {
  conversations: ConversationListItem[];
  has_more: boolean;
  cursor: string | null;
};

export type MessageListItem = {
  id: string;
  content: string;
  direction: "incoming" | "outgoing";
  message_type: string;
  status: string;
  created_at: string;
  evolution_message_id: string | null;
  participant_remote_jid?: string | null; // em grupos: JID de quem enviou
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
