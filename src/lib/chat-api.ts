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

const CHANNELS_API_URL =
  import.meta.env.VITE_EVOLUTION_API_URL || import.meta.env.VITE_CHANNELS_API_URL || "http://localhost:3001";

/** Duração do QR na Evolution (renovação típica ~45s). Sincroniza o contador do modal com o intervalo entre qrcode.updated. */
export const QR_CODE_VALIDITY_MS = 45 * 1000;

/** Normaliza QR da API (qrcode.base64 ou qrCode) para data URL usada em <img src>. */
export function normalizeQrCode(data: { qrCode?: string | null; qrcode?: { base64?: string } | string | null } | null): string | null {
  const raw = data?.qrCode ?? (typeof data?.qrcode === "object" && data?.qrcode !== null ? (data.qrcode as { base64?: string }).base64 : data?.qrcode) ?? null;
  if (!raw || typeof raw !== "string") return null;
  return raw.startsWith("data:") ? raw : `data:image/png;base64,${raw}`;
}

export function getAuthHeaders(accessToken: string): HeadersInit {
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
  if (params?.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  const url = `${CHANNELS_API_URL}/inboxes/${inboxId}/contacts${query ? `?${query}` : ""}`;
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
  messages_inserted?: number;
};

export type SyncInboxOptions = {
  /** Importar mensagens dos últimos N dias (Evolution findMessages por conversa). 0 = não importar. */
  import_messages_days?: number;
};

export async function syncInbox(
  inboxId: string,
  accessToken: string,
  options?: SyncInboxOptions
): Promise<SyncInboxResponse> {
  const params = new URLSearchParams();
  if (options?.import_messages_days != null && options.import_messages_days > 0) {
    params.set("import_messages_days", String(options.import_messages_days));
  }
  const query = params.toString();
  const url = `${CHANNELS_API_URL}/inboxes/${inboxId}/sync${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
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

/** Resposta do perfil comercial (WhatsApp Business) – descrição, horário, site, etc. */
export type BusinessProfileResponse = {
  businessProfile: {
    description?: string;
    website?: string[];
    email?: string;
    address?: string;
    businessHours?: Record<string, { mode: string; hours?: Array<{ open: string; close: string }> }>;
    [key: string]: unknown;
  } | null;
  /** true quando a Evolution falhou e os dados vieram do cache (Supabase). */
  fromCache?: boolean;
  /** Data da última busca bem-sucedida (ISO). */
  fetchedAt?: string | null;
};

export async function getContactBusinessProfile(
  conversationId: string,
  accessToken: string
): Promise<BusinessProfileResponse> {
  const res = await fetch(
    `${CHANNELS_API_URL}/conversations/${conversationId}/contact/business-profile`,
    { method: "GET", headers: getAuthHeaders(accessToken) }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as BusinessProfileResponse;
}

/** Contato retornado pelo refresh de perfil. */
export type RefreshContactProfileResponse = {
  contact: {
    id: string;
    name: string | null;
    remote_jid: string;
    contact_type: string;
    avatar_url: string | null;
  };
};

export async function refreshContactProfile(
  conversationId: string,
  accessToken: string
): Promise<RefreshContactProfileResponse> {
  const res = await fetch(
    `${CHANNELS_API_URL}/conversations/${conversationId}/contact/refresh`,
    { method: "POST", headers: getAuthHeaders(accessToken) }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as RefreshContactProfileResponse;
}

/** Resposta da importação de histórico (Evolution → chat_messages). */
export type ImportConversationHistoryResponse = {
  imported: number;
  total: number;
};

export async function importConversationHistory(
  conversationId: string,
  accessToken: string,
  options?: { limit?: number }
): Promise<ImportConversationHistoryResponse> {
  const res = await fetch(
    `${CHANNELS_API_URL}/conversations/${conversationId}/messages/import`,
    {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ limit: options?.limit ?? 100 }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as ImportConversationHistoryResponse;
}

/** Body para config de importação pós-conexão (estilo Chatwoot). */
export type UpdateChannelImportConfigBody = {
  import_contacts_on_connect?: boolean;
  import_messages_on_connect?: boolean;
  import_messages_days?: number; // 0–30
};

export type UpdateChannelImportConfigResponse = {
  id: string;
  import_contacts_on_connect: boolean;
  import_messages_on_connect: boolean;
  import_messages_days: number;
  updated_at: string;
};

export async function updateChannelImportConfig(
  channelId: string,
  accessToken: string,
  body: UpdateChannelImportConfigBody
): Promise<UpdateChannelImportConfigResponse> {
  const res = await fetch(`${CHANNELS_API_URL}/channels/${channelId}`, {
    method: "PATCH",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Erro ${res.status}`);
  }
  return data as UpdateChannelImportConfigResponse;
}

export { CHANNELS_API_URL };
