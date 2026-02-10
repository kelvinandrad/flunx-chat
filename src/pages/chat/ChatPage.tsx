import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConversationListPanel, Channel } from "./components/ConversationListPanel";
import { Conversation } from "./components/ConversationItem";
import { ChatArea } from "./components/ChatArea";
import { Message } from "./components/MessageBubble";
import { ContactPanel } from "./components/ContactPanel";
import { useChannels } from "@/hooks/useChannels";
import { useConversations } from "@/hooks/useConversations";
import { useInboxLabels } from "@/hooks/useInboxLabels";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { listMessages, updateConversation } from "@/lib/chat-api";
import type { ConversationListItem, MessageListItem } from "@/lib/chat-api-types";
import {
  useContactNotes,
  useContactProposals,
  useScheduledMessages,
  useReminders,
} from "@/hooks/useContactPanel";

function mapInboxToChannel(inbox: {
  id: string;
  name: string;
  channel_type: string;
  connection_status: string;
  whatsapp_phone_number?: string | null;
  whatsapp_profile_name?: string | null;
  whatsapp_profile_pic_url?: string | null;
}): Channel {
  const status =
    inbox.connection_status === "connected"
      ? "connected"
      : inbox.connection_status === "pending"
        ? "connecting"
        : "disconnected";
  const isConnected = status === "connected";
  const displayName =
    isConnected && inbox.whatsapp_profile_name?.trim()
      ? inbox.whatsapp_profile_name.trim()
      : inbox.name;
  return {
    id: inbox.id,
    name: displayName,
    type: (inbox.channel_type as Channel["type"]) || "whatsapp",
    phoneNumber: inbox.whatsapp_phone_number ?? undefined,
    avatar: isConnected ? inbox.whatsapp_profile_pic_url ?? undefined : undefined,
    unreadCount: 0,
    status,
  };
}

/** Fallback quando não há nome: número extraído do JID ou o próprio JID (nunca "Contato"). */
function displayNameFromRemoteJid(remoteJid: string | null | undefined): string {
  const jid = (remoteJid ?? "").trim();
  if (!jid) return "";
  const beforeAt = jid.split("@")[0];
  if (beforeAt && /^\+?\d+$/.test(beforeAt)) return beforeAt;
  return beforeAt || jid;
}

function getDisplayNameForContact(name: string | null | undefined, remoteJid: string | null | undefined): string {
  const n = (name ?? "").trim();
  const jid = (remoteJid ?? "").trim();
  const fallback = displayNameFromRemoteJid(remoteJid);
  if (!n) return fallback || jid || "";
  const isLid = jid.endsWith("@lid");
  const onlyDigits = /^\d+$/.test(n);
  if (isLid && onlyDigits) return fallback || jid || "";
  if (isLid && n === jid.replace(/@.*$/, "")) return fallback || jid || "";
  return n;
}

function mapConversationListItemToConversation(item: ConversationListItem): Conversation {
  const contactName = getDisplayNameForContact(item.contact?.name, item.contact?.remote_jid) || item.contact?.remote_jid || displayNameFromRemoteJid(item.contact?.remote_jid) || "";
  return {
    id: item.id,
    contact: {
      id: item.contact?.id ?? "",
      name: contactName,
      avatar: item.contact?.avatar_url ?? undefined,
      phone: item.contact?.remote_jid ?? undefined,
      contactType: item.contact?.contact_type ?? "individual",
    },
    lastMessage: {
      content: item.preview ?? "",
      timestamp: item.preview_at ?? item.updated_at,
      isFromContact: true,
    },
    unreadCount: 0,
    status: (item.status as Conversation["status"]) ?? "open",
    labels: item.labels && item.labels.length > 0 ? item.labels : undefined,
  };
}

function formatJidAsPhone(jid: string): string {
  const num = jid.replace(/@.*$/, "").replace(/^55/, "");
  if (num.length === 11) return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
  if (num.length === 10) return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
  return num || jid;
}

function mapMessageListItemToMessage(msg: MessageListItem): Message {
  const senderName = msg.participant_remote_jid
    ? formatJidAsPhone(msg.participant_remote_jid)
    : undefined;
  const msgType = (msg.message_type ?? "").toLowerCase();
  let type: "text" | "image" | "audio" | "video" | "document" | undefined;
  if (msgType.includes("audio")) type = "audio";
  else if (msgType.includes("image") || msgType === "sticker") type = "image";
  else if (msgType.includes("video")) type = "video";
  else if (msgType.includes("document")) type = "document";
  return {
    id: msg.id,
    content: msg.content,
    timestamp: msg.created_at,
    isFromContact: msg.direction === "incoming",
    status: msg.status === "failed" ? "failed" : msg.status === "sent" ? "sent" : "delivered",
    senderName,
    type,
    mediaUrl: msg.media_url ?? undefined,
    durationSeconds: msg.duration_seconds ?? undefined,
    waveform: msg.waveform ?? undefined,
  };
}

export default function ChatPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const channelFromUrl = searchParams.get("channel");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    channelFromUrl || "all"
  );
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [isConversationsColumnOpen, setIsConversationsColumnOpen] = useState(true);
  const [listView, setListView] = useState<"all" | "archived" | "pinned">("all");
  const [olderMessages, setOlderMessages] = useState<MessageListItem[]>([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const { session } = useAuth();
  const { organizationId } = useTenant();
  const { channels: inboxes, invalidate: invalidateChannels } = useChannels();
  const channels: Channel[] = inboxes.map(mapInboxToChannel);

  useEffect(() => {
    if (channelFromUrl) return;
    if (selectedChannelId !== "all") return;
    if (channels.length === 0) return;
    setSelectedChannelId(channels[0].id);
  }, [channelFromUrl, selectedChannelId, channels]);

  const inboxIdForConversations =
    selectedChannelId && selectedChannelId !== "all"
      ? selectedChannelId
      : channels[0]?.id ?? null;
  const {
    conversations: conversationsRaw,
    isLoading: conversationsLoading,
    hasMore: hasMoreConversations,
    loadMore: loadMoreConversations,
    isLoadingMore: isLoadingMoreConversations,
    invalidate: invalidateConversations,
  } = useConversations(inboxIdForConversations, {
    includeArchived: listView === "archived",
    pinnedOnly: listView === "pinned",
  });
  const conversations: Conversation[] = conversationsRaw.map(mapConversationListItemToConversation);

  const { options: inboxLabelOptions, labelMap } = useInboxLabels(inboxIdForConversations);

  // Dados (conversas, contatos, etiquetas) vêm via webhook da Evolution; não há sync manual.

  const handleUpdateConversationLabels = useCallback(
    async (conversationId: string, labels: string[]) => {
      if (!session?.access_token) return;
      await updateConversation(conversationId, session.access_token, { labels });
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "chat_conversations" &&
          q.queryKey[1] === inboxIdForConversations,
      });
    },
    [session?.access_token, queryClient, inboxIdForConversations]
  );

  const { messages: messagesRaw, isLoading: messagesLoading, cursor, hasMore, invalidate: invalidateMessages } = useMessages(
    selectedConversationId ?? null
  );

  const allMessagesRaw = [...olderMessages, ...messagesRaw];
  const messages: Message[] = allMessagesRaw.map(mapMessageListItemToMessage).reverse();

  const { send } = useSendMessage(selectedConversationId ?? null);

  // Pre-selecionar canal vindo da URL (?channel=id)
  useEffect(() => {
    if (channelFromUrl) setSelectedChannelId(channelFromUrl);
  }, [channelFromUrl]);

  // Reset older messages when conversation changes
  useEffect(() => {
    setOlderMessages([]);
    setSendError(null);
  }, [selectedConversationId]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const selectedContact = selectedConversation
    ? {
        ...selectedConversation.contact,
        isOnline: selectedConversation.isOnline,
        isTyping: selectedConversation.isTyping,
        labels: selectedConversation.labels,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      }
    : null;

  const contactId = selectedContact?.id ?? null;
  const {
    notes: notesRaw,
    addNote,
    editNote,
    deleteNote,
    togglePinNote,
  } = useContactNotes(contactId);
  const {
    proposals: proposalsRaw,
    createProposal,
    sendProposal,
    closeProposal,
  } = useContactProposals(contactId);
  const {
    scheduledMessages: scheduledMessagesRaw,
    scheduleMessage,
    cancelMessage,
  } = useScheduledMessages(contactId);
  const { reminders: remindersRaw, createReminder, completeReminder } = useReminders(contactId);

  const notes = notesRaw.map((n: any) => ({
    id: n.id,
    content: n.content,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
    author: { id: n.author?.id ?? "", name: n.author?.full_name ?? "Usuário" },
    isPinned: n.is_pinned ?? false,
  }));

  const proposals = proposalsRaw.map((p: any) => ({
    id: p.id,
    title: p.title,
    status: p.status as any,
    totalValue: parseFloat(p.total_value ?? 0),
    createdAt: p.created_at,
    items: Array.isArray(p.items) ? p.items : [],
  }));

  const scheduledMessages = scheduledMessagesRaw.map((m: any) => ({
    id: m.id,
    content: m.content,
    scheduledAt: m.scheduled_at,
    status: m.status as any,
    type: m.type as any,
  }));

  const reminders = remindersRaw.map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    dueAt: r.due_at,
    status: r.status as any,
  }));

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversationId) return;
      setSendError(null);
      try {
        await send({ content });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setSendError(msg);
      }
    },
    [selectedConversationId, send]
  );

  const handleLoadOlder = useCallback(async () => {
    if (!selectedConversationId || !session?.access_token || !cursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const result = await listMessages(selectedConversationId, session.access_token, { before: cursor });
      setOlderMessages((prev) => [...prev, ...result.messages]);
    } catch (e) {
      console.error("Erro ao carregar mensagens antigas:", e);
    } finally {
      setLoadingOlder(false);
    }
  }, [selectedConversationId, session, cursor, loadingOlder]);

  const handleRetry = useCallback(() => {
    setSendError(null);
  }, []);

  const handleAddNote = useCallback(
    async (content: string) => {
      if (!contactId || !organizationId) return;
      try {
        await addNote.mutateAsync({ contactId, organizationId, content });
      } catch (e) {
        console.error("Erro ao adicionar nota:", e);
      }
    },
    [contactId, organizationId, addNote]
  );

  const handleEditNote = useCallback(
    async (noteId: string, content: string) => {
      try {
        await editNote.mutateAsync({ noteId, content });
      } catch (e) {
        console.error("Erro ao editar nota:", e);
      }
    },
    [editNote]
  );

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      try {
        await deleteNote.mutateAsync(noteId);
      } catch (e) {
        console.error("Erro ao deletar nota:", e);
      }
    },
    [deleteNote]
  );

  const handleTogglePinNote = useCallback(
    async (noteId: string) => {
      const note = notesRaw.find((n: any) => n.id === noteId);
      if (!note) return;
      try {
        await togglePinNote.mutateAsync({ noteId, isPinned: note.is_pinned ?? false });
      } catch (e) {
        console.error("Erro ao fixar/desafixar nota:", e);
      }
    },
    [notesRaw, togglePinNote]
  );

  const handleCreateProposal = useCallback(
    async (proposal: any) => {
      if (!contactId || !organizationId) return;
      try {
        await createProposal.mutateAsync({ contactId, organizationId, proposal });
      } catch (e) {
        console.error("Erro ao criar proposta:", e);
      }
    },
    [contactId, organizationId, createProposal]
  );

  const handleSendProposal = useCallback(
    async (proposalId: string) => {
      try {
        await sendProposal.mutateAsync(proposalId);
      } catch (e) {
        console.error("Erro ao enviar proposta:", e);
      }
    },
    [sendProposal]
  );

  const handleCloseProposal = useCallback(
    async (proposalId: string, status: "accepted" | "rejected") => {
      try {
        await closeProposal.mutateAsync({ proposalId, status });
      } catch (e) {
        console.error("Erro ao fechar proposta:", e);
      }
    },
    [closeProposal]
  );

  const handleScheduleMessage = useCallback(
    async (msg: any) => {
      if (!contactId || !organizationId) return;
      try {
        await scheduleMessage.mutateAsync({
          contactId,
          organizationId,
          conversationId: selectedConversationId,
          message: msg,
        });
      } catch (e) {
        console.error("Erro ao agendar mensagem:", e);
      }
    },
    [contactId, organizationId, selectedConversationId, scheduleMessage]
  );

  const handleCancelMessage = useCallback(
    async (messageId: string) => {
      try {
        await cancelMessage.mutateAsync(messageId);
      } catch (e) {
        console.error("Erro ao cancelar mensagem:", e);
      }
    },
    [cancelMessage]
  );

  const handleCreateReminder = useCallback(
    async (reminder: any) => {
      if (!contactId || !organizationId) return;
      try {
        await createReminder.mutateAsync({ contactId, organizationId, reminder });
      } catch (e) {
        console.error("Erro ao criar lembrete:", e);
      }
    },
    [contactId, organizationId, createReminder]
  );

  const handleCompleteReminder = useCallback(
    async (reminderId: string) => {
      try {
        await completeReminder.mutateAsync(reminderId);
      } catch (e) {
        console.error("Erro ao completar lembrete:", e);
      }
    },
    [completeReminder]
  );

  return (
    <AppLayout>
      <div className="h-full flex-1 flex bg-background overflow-hidden min-h-0">
        {isConversationsColumnOpen && (
          <div className="flex flex-col border-r border-border/50 w-[360px] max-w-full">
            <ConversationListPanel
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              channels={channels}
              selectedChannelId={selectedChannelId}
              onSelectChannel={setSelectedChannelId}
              isLoading={conversationsLoading}
              hasMoreConversations={hasMoreConversations}
              onLoadMoreConversations={loadMoreConversations}
              isLoadingMoreConversations={isLoadingMoreConversations}
              listView={listView}
              onListViewChange={setListView}
              onUpdateConversationLabels={handleUpdateConversationLabels}
              inboxLabelOptions={inboxLabelOptions}
              labelMap={labelMap}
            />
          </div>
        )}

        <ChatArea
          contact={selectedContact}
          messages={selectedConversationId ? messages : []}
          onSendMessage={handleSendMessage}
          onToggleContactPanel={() => setIsContactPanelOpen(!isContactPanelOpen)}
          isContactPanelOpen={isContactPanelOpen}
          isConversationsColumnOpen={isConversationsColumnOpen}
          onToggleConversationsColumn={() => setIsConversationsColumnOpen((v) => !v)}
          isLoading={messagesLoading}
          hasMoreMessages={hasMore}
          onLoadMore={handleLoadOlder}
          isLoadingMore={loadingOlder}
          sendError={sendError}
          onRetrySend={handleRetry}
        />

        {isContactPanelOpen && selectedContact && (
          <ContactPanel
            contact={selectedContact}
            conversationId={selectedConversationId ?? undefined}
            accessToken={session?.access_token ?? undefined}
            inboxLabelOptions={inboxLabelOptions}
            notes={notes}
            proposals={proposals}
            scheduledMessages={scheduledMessages}
            reminders={reminders}
            onClose={() => setIsContactPanelOpen(false)}
            onRefreshContact={invalidateConversations}
            onImportHistory={invalidateMessages}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            onTogglePinNote={handleTogglePinNote}
            onCreateProposal={handleCreateProposal}
            onSendProposal={handleSendProposal}
            onCloseProposal={handleCloseProposal}
            onScheduleMessage={handleScheduleMessage}
            onCancelMessage={handleCancelMessage}
            onCreateReminder={handleCreateReminder}
            onCompleteReminder={handleCompleteReminder}
          />
        )}
      </div>
    </AppLayout>
  );
}
