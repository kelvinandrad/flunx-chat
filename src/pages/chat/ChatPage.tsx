import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConversationListPanel, Channel } from "./components/ConversationListPanel";
import { Conversation } from "./components/ConversationItem";
import { ChatArea } from "./components/ChatArea";
import { Message } from "./components/MessageBubble";
import { ContactPanel } from "./components/ContactPanel";
import { cn } from "@/lib/utils";

// Mock data - será substituído por dados reais do Supabase
const MOCK_CHANNELS: Channel[] = [
  {
    id: "ch1",
    name: "Kelvin Andrade",
    type: "whatsapp",
    phoneNumber: "(62) 99928-8205",
    avatar: "",
    unreadCount: 5,
    status: "connected",
  },
  {
    id: "ch2",
    name: "Suporte Comercial",
    type: "whatsapp",
    phoneNumber: "(11) 98765-4321",
    unreadCount: 2,
    status: "connected",
  },
  {
    id: "ch3",
    name: "Vendas",
    type: "whatsapp",
    phoneNumber: "(21) 91234-5678",
    unreadCount: 0,
    status: "disconnected",
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    contact: {
      id: "c1",
      name: "Pequena❤️",
      phone: "+55 62 99999-0001",
    },
    lastMessage: {
      content: "Pra saber o tamanho da cortina kk",
      timestamp: new Date().toISOString(),
      isFromContact: true,
    },
    unreadCount: 2,
    status: "open",
    isOnline: true,
    labels: ["Lead quente"],
  },
  {
    id: "conv2",
    contact: {
      id: "c2",
      name: "Edilberto Andrade",
      phone: "+55 62 99999-0002",
    },
    lastMessage: {
      content: "sem contexto fica difícil verificar, vou a...",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isFromContact: true,
    },
    unreadCount: 0,
    status: "open",
    isTyping: true,
  },
  {
    id: "conv3",
    contact: {
      id: "c3",
      name: "SUPORTE | Luuvi Aprovec.",
      phone: "+55 11 98765-4321",
    },
    lastMessage: {
      content: "Mensagem apagada",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isFromContact: false,
    },
    unreadCount: 0,
    status: "open",
    labels: ["Cliente", "VIP"],
  },
  {
    id: "conv4",
    contact: {
      id: "c4",
      name: "LimpaCrm - REINICIA EN...",
      avatar: "",
      phone: "+55 21 91234-5678",
    },
    lastMessage: {
      content: "~ Dayane Villas: Já está incluso o v...",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      isFromContact: true,
    },
    unreadCount: 8,
    status: "pending",
    labels: ["Follow-up"],
  },
  {
    id: "conv5",
    contact: {
      id: "c5",
      name: "LimpaCrm + Avantti",
      phone: "+55 31 99876-5432",
    },
    lastMessage: {
      content: "~ Pedrocunha: 📄 Contrato Modelo ...",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      isFromContact: true,
    },
    unreadCount: 7,
    status: "open",
  },
  {
    id: "conv6",
    contact: {
      id: "c6",
      name: "LimpaCrm - ReCred+",
      phone: "+55 41 98765-1234",
    },
    lastMessage: {
      content: "~ Recred+: 🎤 0:26",
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      isFromContact: true,
    },
    unreadCount: 5,
    status: "open",
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    content: "Olá! Tudo bem?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isFromContact: true,
    status: "read",
  },
  {
    id: "m2",
    content: "Oi! Tudo sim, e você?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    isFromContact: false,
    status: "read",
  },
  {
    id: "m3",
    content: "Estou bem! Gostaria de saber mais sobre o produto X",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    isFromContact: true,
    status: "read",
  },
  {
    id: "m4",
    content: "Claro! O produto X é perfeito para você. Ele oferece:\n\n• Funcionalidade 1\n• Funcionalidade 2\n• Funcionalidade 3\n\nPosso te enviar mais detalhes?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
    isFromContact: false,
    status: "read",
  },
  {
    id: "m5",
    content: "Sim, por favor! Qual o valor?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isFromContact: true,
    status: "read",
  },
  {
    id: "m6",
    content: "O investimento é de R$ 199,90/mês. Temos também uma condição especial para contratação anual com 20% de desconto! 🎉",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isFromContact: false,
    status: "delivered",
  },
  {
    id: "m7",
    content: "Interessante! Vou conversar com meu sócio e te retorno",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isFromContact: true,
    status: "read",
  },
];

const MOCK_NOTES = [
  {
    id: "n1",
    content: "Cliente interessado no plano empresarial. Aguardando retorno do sócio para fechar.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    author: { id: "1", name: "Você" },
    isPinned: true,
  },
  {
    id: "n2",
    content: "Enviar proposta formal por email",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    author: { id: "1", name: "Você" },
  },
];

const MOCK_PROPOSALS = [
  {
    id: "p1",
    title: "Proposta Plano Empresarial",
    status: "sent" as const,
    totalValue: 499.90,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    items: [
      { productId: "3", productName: "Plano Empresarial", quantity: 1, unitPrice: 499.90 },
    ],
  },
];

const MOCK_SCHEDULED_MESSAGES = [
  {
    id: "sm1",
    content: "Olá! Gostaria de saber se teve a oportunidade de analisar nossa proposta.",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: "pending" as const,
    type: "follow-up" as const,
  },
];

const MOCK_REMINDERS = [
  {
    id: "r1",
    title: "Ligar para confirmar reunião",
    description: "Reunião agendada para sexta às 14h",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "active" as const,
  },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>("all");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [isConversationsColumnOpen, setIsConversationsColumnOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [scheduledMessages, setScheduledMessages] = useState(MOCK_SCHEDULED_MESSAGES);
  const [reminders, setReminders] = useState(MOCK_REMINDERS);

  // Get selected conversation
  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  
  // Get contact from selected conversation
  const selectedContact = selectedConversation
    ? {
        ...selectedConversation.contact,
        isOnline: selectedConversation.isOnline,
        isTyping: selectedConversation.isTyping,
        labels: selectedConversation.labels,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      }
    : null;

  // Handle send message
  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      isFromContact: false,
      status: "sending",
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate message sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, status: "delivered" } : m
        )
      );
    }, 1000);
  };

  // Handle add note
  const handleAddNote = (content: string) => {
    const newNote = {
      id: `n${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author: { id: "1", name: "Você" },
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  return (
    <AppLayout>
      <div className="h-full flex-1 flex bg-background overflow-hidden min-h-0">
        {/* Conversation list with channel selector (colapsável) */}
        {isConversationsColumnOpen && (
          <ConversationListPanel
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => {
              setSelectedConversationId(id);
              setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            channels={MOCK_CHANNELS}
            selectedChannelId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
          />
        )}

        {/* Chat area */}
        <ChatArea
          contact={selectedContact}
          messages={selectedConversationId ? messages : []}
          onSendMessage={handleSendMessage}
          onToggleContactPanel={() => setIsContactPanelOpen(!isContactPanelOpen)}
          isContactPanelOpen={isContactPanelOpen}
          isConversationsColumnOpen={isConversationsColumnOpen}
          onToggleConversationsColumn={() => setIsConversationsColumnOpen((v) => !v)}
        />

        {/* Contact panel */}
        {isContactPanelOpen && selectedContact && (
          <ContactPanel
            contact={selectedContact}
            notes={notes}
            proposals={proposals}
            scheduledMessages={scheduledMessages}
            reminders={reminders}
            onClose={() => setIsContactPanelOpen(false)}
            onAddNote={handleAddNote}
            onEditNote={(id, content) => {
              setNotes((prev) =>
                prev.map((n) =>
                  n.id === id
                    ? { ...n, content, updatedAt: new Date().toISOString() }
                    : n
                )
              );
            }}
            onDeleteNote={(id) => {
              setNotes((prev) => prev.filter((n) => n.id !== id));
            }}
            onTogglePinNote={(id) => {
              setNotes((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
              );
            }}
            onCreateProposal={(proposal) => {
              const newProposal = {
                ...proposal,
                id: `p${Date.now()}`,
                createdAt: new Date().toISOString(),
              };
              setProposals((prev) => [newProposal, ...prev]);
            }}
            onSendProposal={(id) => {
              setProposals((prev) =>
                prev.map((p) =>
                  p.id === id
                    ? { ...p, status: "sent" as const, sentAt: new Date().toISOString() }
                    : p
                )
              );
            }}
            onCloseProposal={(id, status) => {
              setProposals((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status } : p))
              );
            }}
            onScheduleMessage={(msg) => {
              const newMsg = {
                ...msg,
                id: `sm${Date.now()}`,
                status: "pending" as const,
              };
              setScheduledMessages((prev) => [...prev, newMsg]);
            }}
            onCancelMessage={(id) => {
              setScheduledMessages((prev) =>
                prev.map((m) =>
                  m.id === id ? { ...m, status: "cancelled" as const } : m
                )
              );
            }}
            onCreateReminder={(reminder) => {
              const newReminder = {
                ...reminder,
                id: `r${Date.now()}`,
                status: "active" as const,
              };
              setReminders((prev) => [...prev, newReminder]);
            }}
            onCompleteReminder={(id) => {
              setReminders((prev) =>
                prev.map((r) =>
                  r.id === id ? { ...r, status: "completed" as const } : r
                )
              );
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
