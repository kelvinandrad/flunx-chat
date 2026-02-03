/**
 * Cliente da API de chat (flunx-channels-api).
 * Todas as rotas de conversas/mensagens exigem Authorization: Bearer <Supabase JWT>.
 * @see docs/FLUNX-CHAT-EVOLUTION-PLANO.md — Fase 2 e 3
 */

import type {
  ConversationListItem,
  ListConversationsParams,
  ListConversationsResponse,
  ListContactsParams,
  ListContactsResponse,
  ListMessagesResponse,
  SendMessageBody,
  SendMessageResponse,
  UpdateConversationBody,
} from "./chat-api-types";

const CHANNELS_API_URL = import.meta.env.VITE_CHANNELS_API_URL || "http://localhost:3001";

/** Normaliza QR da API (qrcode.base64 ou qrCode) para data URL usada em <img src>. */
export function normalizeQrCode(data: { qrCode?: string | null; qrcode?: { base64?: string } | string | null } | null): string | null {
  const raw = data?.qrCode ?? (typeof data?.qrcode === "object" && data?.qrcode !== null ? (data.qrcode as { base64?: string }).base64 : data?.qrcode) ?? null;
  if (!raw || typeof raw !== "string") return null;
  return raw.startsWith("data:") ? raw : `data:image/png;base64,${raw}`;
}

function getAuthHeaders(accessToken: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function listConversations(
  inboxId: string,
  accessToken: string,
  params?: ListConversationsParams
): Promise<ListConversationsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.days != null) searchParams.set("days", String(params.days));
  if (params?.before) searchParams.set("before", params.before);
  if (params?.only_with_messages === false) searchParams.set("only_with_messages", "false");
  if (params?.include_archived === true) searchParams.set("include_archived", "true");
  if (params?.pinned === true) searchParams.set("pinned", "true");
  const query = searchParams.toString();
  const url = `${CHANNELS_API_URL}/inboxes/${inboxId}/conversations${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(accessToken),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as ListConversationsResponse;
}

export async function listContacts(
  inboxId: string,
  accessToken: string,
  params?: ListContactsParams
): Promise<ListContactsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.before) searchParams.set("before", params.before);
  const query = searchParams.toString();
  // Trailing slash para evitar 404 intermitente no proxy (ex.: /contacts vs /contacts/)
  const url = `${CHANNELS_API_URL}/inboxes/${inboxId}/contacts/${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(accessToken),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as ListContactsResponse;
}

export interface ListMessagesParams {
  limit?: number;
  before?: string; // cursor: created_at ISO para carregar mensagens mais antigas
}

export async function listMessages(
  conversationId: string,
  accessToken: string,
  params?: ListMessagesParams
): Promise<ListMessagesResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.before) searchParams.set("before", params.before);
  const query = searchParams.toString();
  const url = `${CHANNELS_API_URL}/conversations/${conversationId}/messages${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(accessToken),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as ListMessagesResponse;
}

export type SyncInboxResponse = {
  success: boolean;
  contacts_processed?: number;
  chats_processed?: number;
  contacts_created: number;
  conversations_created: number;
};

export async function syncInbox(
  inboxId: string,
  accessToken: string
): Promise<SyncInboxResponse> {
  const res = await fetch(`${CHANNELS_API_URL}/inboxes/${inboxId}/sync`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as SyncInboxResponse;
}

export async function sendMessage(
  conversationId: string,
  body: SendMessageBody,
  accessToken: string
): Promise<SendMessageResponse> {
  const res = await fetch(`${CHANNELS_API_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || data?.detail || `Erro ${res.status}`) as Error & {
      status?: number;
      messageResponse?: SendMessageResponse;
    };
    err.status = res.status;
    if (data?.message) err.messageResponse = data.message as SendMessageResponse;
    throw err;
  }
  return data as SendMessageResponse;
}

export async function updateConversation(
  conversationId: string,
  accessToken: string,
  body: UpdateConversationBody
): Promise<ConversationListItem> {
  const res = await fetch(`${CHANNELS_API_URL}/conversations/${conversationId}`, {
    method: "PATCH",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as ConversationListItem;
}

export { CHANNELS_API_URL };
