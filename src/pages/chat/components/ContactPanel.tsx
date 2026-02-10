import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  X,
  User,
  StickyNote,
  Briefcase,
  Zap,
  ExternalLink,
  MessageSquare,
  Globe,
  Mail,
  MapPin,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { InboxLabelOption } from "@/hooks/useInboxLabels";
import { getContactBusinessProfile, refreshContactProfile, importConversationHistory, type BusinessProfileResponse } from "@/lib/chat-api";
import { ContactInfoTab } from "./tabs/ContactInfoTab";
import { ContactNotesTab } from "./tabs/ContactNotesTab";
import { ContactCommercialTab } from "./tabs/ContactCommercialTab";
import { ContactAutomationTab } from "./tabs/ContactAutomationTab";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  createdAt?: string;
  labels?: string[];
  customFields?: Record<string, string>;
  isOnline?: boolean;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: { id: string; name: string; avatar?: string };
  isPinned?: boolean;
}

interface Proposal {
  id: string;
  title: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  totalValue: number;
  createdAt: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
}

interface ScheduledMessage {
  id: string;
  content: string;
  scheduledAt: string;
  status: "pending" | "sent" | "failed" | "cancelled";
  type: "follow-up" | "reminder" | "promotion" | "custom";
}

interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueAt: string;
  status: "active" | "completed" | "dismissed";
}

interface ContactPanelProps {
  contact: Contact;
  /** ID da conversa atual (para buscar perfil comercial WhatsApp). */
  conversationId?: string | null;
  /** Token para chamadas à API de chat. */
  accessToken?: string | null;
  /** Etiquetas do canal (chat_inbox_labels) para a aba Info do contato. */
  inboxLabelOptions?: InboxLabelOption[];
  notes: Note[];
  proposals: Proposal[];
  scheduledMessages: ScheduledMessage[];
  reminders: Reminder[];
  onClose: () => void;
  /** Chamado após atualizar perfil (nome/foto) para refletir na lista. */
  onRefreshContact?: () => void;
  /** Chamado após importar histórico para recarregar mensagens. */
  onImportHistory?: () => void;
  onUpdateContact?: (updates: Partial<Contact>) => void;
  onAddNote?: (content: string) => void;
  onEditNote?: (noteId: string, content: string) => void;
  onDeleteNote?: (noteId: string) => void;
  onTogglePinNote?: (noteId: string) => void;
  onCreateProposal?: (proposal: any) => void;
  onSendProposal?: (proposalId: string) => void;
  onCloseProposal?: (proposalId: string, status: "accepted" | "rejected") => void;
  onScheduleMessage?: (message: any) => void;
  onCancelMessage?: (messageId: string) => void;
  onCreateReminder?: (reminder: any) => void;
  onCompleteReminder?: (reminderId: string) => void;
}

export function ContactPanel({
  contact,
  conversationId,
  accessToken,
  inboxLabelOptions = [],
  notes,
  proposals,
  scheduledMessages,
  reminders,
  onClose,
  onRefreshContact,
  onImportHistory,
  onUpdateContact,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onTogglePinNote,
  onCreateProposal,
  onSendProposal,
  onCloseProposal,
  onScheduleMessage,
  onCancelMessage,
  onCreateReminder,
  onCompleteReminder,
}: ContactPanelProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [businessProfileOpen, setBusinessProfileOpen] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfileResponse["businessProfile"] | null>(null);
  const [businessProfileFromCache, setBusinessProfileFromCache] = useState(false);
  const [businessProfileFetchedAt, setBusinessProfileFetchedAt] = useState<string | null>(null);
  const [businessProfileLoading, setBusinessProfileLoading] = useState(false);
  const [businessProfileError, setBusinessProfileError] = useState<string | null>(null);
  const [refreshProfileLoading, setRefreshProfileLoading] = useState(false);
  const [importHistoryLoading, setImportHistoryLoading] = useState(false);

  const handleImportHistory = async () => {
    if (!conversationId || !accessToken) return;
    setImportHistoryLoading(true);
    try {
      await importConversationHistory(conversationId, accessToken, { limit: 100 });
      onImportHistory?.();
    } finally {
      setImportHistoryLoading(false);
    }
  };

  const handleRefreshProfile = async () => {
    if (!conversationId || !accessToken) return;
    setRefreshProfileLoading(true);
    try {
      const res = await refreshContactProfile(conversationId, accessToken);
      onUpdateContact?.({ name: res.contact.name ?? contact.name, avatar: res.contact.avatar_url ?? undefined });
      onRefreshContact?.();
    } finally {
      setRefreshProfileLoading(false);
    }
  };

  const handleVerPerfil = async () => {
    if (!conversationId || !accessToken) {
      setBusinessProfileError("Não foi possível carregar o perfil (conversa ou sessão indisponível).");
      setBusinessProfileOpen(true);
      return;
    }
    setBusinessProfileOpen(true);
    setBusinessProfileLoading(true);
    setBusinessProfileError(null);
    setBusinessProfile(null);
    setBusinessProfileFromCache(false);
    setBusinessProfileFetchedAt(null);
    try {
      const res = await getContactBusinessProfile(conversationId, accessToken);
      setBusinessProfile(res.businessProfile ?? null);
      setBusinessProfileFromCache(res.fromCache ?? false);
      setBusinessProfileFetchedAt(res.fetchedAt ?? null);
    } catch (e) {
      setBusinessProfileError(e instanceof Error ? e.message : "Erro ao carregar perfil comercial.");
    } finally {
      setBusinessProfileLoading(false);
    }
  };

  // Count badges
  const notesCount = notes.length;
  const pendingProposals = proposals.filter((p) =>
    ["draft", "sent", "viewed"].includes(p.status)
  ).length;
  const pendingAutomations =
    scheduledMessages.filter((m) => m.status === "pending").length +
    reminders.filter((r) => r.status === "active").length;

  return (
    <div className="h-full w-[400px] min-w-[360px] border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-sm">Dados do contato</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TabsList className="grid grid-cols-4 mx-4 mt-3 h-10 flex-shrink-0 min-w-0">
          <TabsTrigger value="info" className="relative flex-shrink-0">
            <User className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="notes" className="relative flex-shrink-0">
            <StickyNote className="h-4 w-4" />
            {notesCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full px-1">
                {notesCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="commercial" className="relative flex-shrink-0">
            <Briefcase className="h-4 w-4" />
            {pendingProposals > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] bg-orange-500 text-white rounded-full px-1">
                {pendingProposals}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="automation" className="relative flex-shrink-0">
            <Zap className="h-4 w-4" />
            {pendingAutomations > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] bg-blue-500 text-white rounded-full px-1">
                {pendingAutomations}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <ScrollArea className="flex-1 mt-3 min-h-0">
          <TabsContent value="info" className="px-4 pb-4 m-0 min-w-0 overflow-hidden">
            <ContactInfoTab contact={contact} onUpdate={onUpdateContact} inboxLabelOptions={inboxLabelOptions} />
          </TabsContent>

          <TabsContent value="notes" className="px-4 pb-4 m-0 h-full min-w-0 overflow-hidden">
            <ContactNotesTab
              notes={notes}
              onAddNote={onAddNote}
              onEditNote={onEditNote}
              onDeleteNote={onDeleteNote}
              onTogglePin={onTogglePinNote}
            />
          </TabsContent>

          <TabsContent value="commercial" className="px-4 pb-4 m-0 min-w-0 overflow-hidden">
            <ContactCommercialTab
              proposals={proposals}
              products={[]}
              onCreateProposal={onCreateProposal}
              onSendProposal={onSendProposal}
              onCloseProposal={onCloseProposal}
            />
          </TabsContent>

          <TabsContent value="automation" className="px-4 pb-4 m-0 min-w-0 overflow-hidden">
            <ContactAutomationTab
              scheduledMessages={scheduledMessages}
              reminders={reminders}
              onScheduleMessage={onScheduleMessage}
              onCancelMessage={onCancelMessage}
              onCreateReminder={onCreateReminder}
              onCompleteReminder={onCompleteReminder}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Footer actions */}
      <div className="p-3 border-t border-border flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            size="sm"
            onClick={handleImportHistory}
            disabled={!conversationId || !accessToken || importHistoryLoading}
          >
            {importHistoryLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            Importar histórico
          </Button>
          <Button variant="outline" className="flex-1 gap-2" size="sm" onClick={handleVerPerfil}>
            <ExternalLink className="h-4 w-4" />
            Ver perfil
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full gap-2 text-muted-foreground"
          size="sm"
          onClick={handleRefreshProfile}
          disabled={!conversationId || !accessToken || refreshProfileLoading}
        >
          {refreshProfileLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Atualizar nome e foto
        </Button>
      </div>

      {/* Modal Perfil comercial (WhatsApp Business) */}
      <Dialog open={businessProfileOpen} onOpenChange={setBusinessProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Perfil comercial</DialogTitle>
            <DialogDescription>
              Dados do perfil WhatsApp Business de {contact.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {businessProfileLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground py-6">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Carregando...</span>
              </div>
            )}
            {businessProfileError && !businessProfileLoading && (
              <p className="text-sm text-destructive">{businessProfileError}</p>
            )}
            {!businessProfileLoading && !businessProfileError && businessProfile && (
              <div className="space-y-3 text-sm">
                {(businessProfileFromCache || businessProfileFetchedAt) && (
                  <p className="text-xs text-muted-foreground">
                    {businessProfileFromCache ? "Dados em cache (Evolution indisponível). " : ""}
                    {businessProfileFetchedAt
                      ? `Última atualização: ${new Date(businessProfileFetchedAt).toLocaleString("pt-BR")}`
                      : ""}
                  </p>
                )}
                {businessProfile.description && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Descrição</p>
                    <p className="text-foreground">{businessProfile.description}</p>
                  </div>
                )}
                {Array.isArray(businessProfile.website) && businessProfile.website.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    {businessProfile.website.map((url, i) => (
                      <a
                        key={i}
                        href={url.startsWith("http") ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                )}
                {businessProfile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${businessProfile.email}`} className="text-primary hover:underline">
                      {businessProfile.email}
                    </a>
                  </div>
                )}
                {businessProfile.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{businessProfile.address}</span>
                  </div>
                )}
                {businessProfile.businessHours && typeof businessProfile.businessHours === "object" && Object.keys(businessProfile.businessHours).length > 0 && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Horário de funcionamento
                    </p>
                    <ul className="text-muted-foreground space-y-0.5">
                      {Object.entries(businessProfile.businessHours).map(([day, cfg]) => {
                        const mode = typeof cfg === "object" && cfg !== null && "mode" in cfg ? (cfg as { mode?: string }).mode : "";
                        const hours = typeof cfg === "object" && cfg !== null && "hours" in cfg ? (cfg as { hours?: Array<{ open: string; close: string }> }).hours : [];
                        const line = mode === "open" && Array.isArray(hours) && hours.length
                          ? hours.map((h) => `${h.open} – ${h.close}`).join(", ")
                          : mode === "closed"
                            ? "Fechado"
                            : "—";
                        return (
                          <li key={day}>
                            <span className="capitalize">{day}</span>: {line}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {!businessProfile.description && !businessProfile.website?.length && !businessProfile.email && !businessProfile.address && (!businessProfile.businessHours || Object.keys(businessProfile.businessHours).length === 0) && (
                  <p className="text-muted-foreground">Nenhum dado de perfil comercial disponível.</p>
                )}
              </div>
            )}
            {!businessProfileLoading && !businessProfileError && !businessProfile && (
              <p className="text-muted-foreground text-sm">Este contato não possui perfil comercial ou os dados não estão disponíveis.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
