import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, X, ChevronDown, Check, Loader2, Tag } from "lucide-react";
import { ConversationItem, Conversation } from "./ConversationItem";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { InboxLabelOption } from "@/hooks/useInboxLabels";
import { cn } from "@/lib/utils";

export interface Channel {
  id: string;
  name: string;
  type: "whatsapp" | "email" | "webchat" | "instagram" | "telegram";
  avatar?: string;
  unreadCount: number;
  status: "connected" | "disconnected" | "connecting";
  phoneNumber?: string;
}

export type ListViewMode = "all" | "archived" | "pinned";

interface ConversationListPanelProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  channels: Channel[];
  selectedChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
  isLoading?: boolean;
  hasMoreConversations?: boolean;
  onLoadMoreConversations?: () => void;
  isLoadingMoreConversations?: boolean;
  listView?: ListViewMode;
  onListViewChange?: (view: ListViewMode) => void;
  onUpdateConversationLabels?: (conversationId: string, labels: string[]) => Promise<void>;
  /** Etiquetas do canal (chat_inbox_labels); usado em filtros e edição de etiquetas da conversa. */
  inboxLabelOptions?: InboxLabelOption[];
  /** Mapa id (evolution_label_id) -> { name, colorClass } para exibir nomes/cores nos itens. */
  labelMap?: Record<string, { name: string; colorClass: string }>;
  /** Tab de status (estilo Chatwoot). Quando definido, a lista é filtrada no servidor por status. */
  activeStatusTab?: FilterTab;
  onStatusTabChange?: (tab: FilterTab) => void;
}

type FilterTab = "all" | "unread" | "open" | "pending" | "resolved";

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
  { value: "open", label: "Abertas" },
  { value: "pending", label: "Pendentes" },
  { value: "resolved", label: "Resolvidas" },
];

export function ConversationListPanel({
  conversations,
  selectedConversationId,
  onSelectConversation,
  channels,
  selectedChannelId,
  onSelectChannel,
  isLoading,
  hasMoreConversations,
  onLoadMoreConversations,
  isLoadingMoreConversations,
  listView = "all",
  onListViewChange,
  onUpdateConversationLabels,
  inboxLabelOptions = [],
  labelMap = {},
  activeStatusTab,
  onStatusTabChange,
}: ConversationListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [internalTab, setInternalTab] = useState<FilterTab>("all");
  const activeTab = activeStatusTab ?? internalTab;
  const setActiveTab = useCallback(
    (tab: FilterTab) => {
      if (onStatusTabChange) onStatusTabChange(tab);
      else setInternalTab(tab);
    },
    [onStatusTabChange]
  );
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [labelsPopoverOpen, setLabelsPopoverOpen] = useState(false);
  const [labelsEditDraft, setLabelsEditDraft] = useState<string[]>([]);
  const [labelsEditSaving, setLabelsEditSaving] = useState(false);
  // Draft state when popover is open (user can change and then Apply or Cancel)
  const [draftStatus, setDraftStatus] = useState<FilterTab>(activeTab);
  const [draftLabels, setDraftLabels] = useState<string[]>(selectedLabels);

  // Sync draft when opening popover (copy current applied filters to draft)
  useEffect(() => {
    if (filterPopoverOpen) {
      setDraftStatus(activeTab);
      setDraftLabels(selectedLabels.slice());
    }
  }, [filterPopoverOpen, activeTab, selectedLabels]);

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null;

  // Sync labels-edit draft when opening popover or when selected conversation changes (not on every conversations refetch)
  useEffect(() => {
    if (!labelsPopoverOpen || !selectedConversationId) return;
    const conv = conversations.find((c) => c.id === selectedConversationId);
    setLabelsEditDraft(conv?.labels ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync on open/conv change, not when conversations array reference changes
  }, [labelsPopoverOpen, selectedConversationId]);

  const toggleLabelsEditDraft = (labelId: string) => {
    setLabelsEditDraft((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  const applyLabelsEdit = async () => {
    if (!selectedConversationId || !onUpdateConversationLabels) return;
    setLabelsEditSaving(true);
    try {
      await onUpdateConversationLabels(selectedConversationId, labelsEditDraft);
      setLabelsPopoverOpen(false);
    } finally {
      setLabelsEditSaving(false);
    }
  };

  // Get selected channel info
  const selectedChannel = channels.find((c) => c.id === selectedChannelId);
  const totalUnread = channels.reduce((acc, ch) => acc + ch.unreadCount, 0);

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = conv.contact.name.toLowerCase().includes(query);
      const matchesMessage = conv.lastMessage.content.toLowerCase().includes(query);
      const matchesPhone = conv.contact.phone?.toLowerCase().includes(query);
      if (!matchesName && !matchesMessage && !matchesPhone) return false;
    }

    // Status filter
    switch (activeTab) {
      case "unread":
        if (conv.unreadCount === 0) return false;
        break;
      case "open":
        if (conv.status !== "open") return false;
        break;
      case "pending":
        if (conv.status !== "pending") return false;
        break;
      case "resolved":
        if (conv.status !== "resolved") return false;
        break;
    }

    // Label filter
    if (selectedLabels.length > 0) {
      if (!conv.labels?.some((l) => selectedLabels.includes(l))) return false;
    }

    return true;
  });

  const unreadCount = conversations.filter((c) => c.unreadCount > 0).length;

  const toggleDraftLabel = (labelId: string) => {
    setDraftLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((l) => l !== labelId)
        : [...prev, labelId]
    );
  };

  const applyFilters = () => {
    setActiveTab(draftStatus);
    setSelectedLabels([...draftLabels]);
    setFilterPopoverOpen(false);
  };

  const cancelFilters = () => {
    setDraftStatus(activeTab);
    setDraftLabels([...selectedLabels]);
    setFilterPopoverOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setSelectedLabels([]);
    setDraftStatus("all");
    setDraftLabels([]);
  };

  const hasActiveFilters = searchQuery || activeTab !== "all" || selectedLabels.length > 0;

  return (
    <div className="h-full flex flex-col bg-card border-r border-border w-80">
      {/* Top row: Seletor de Canais | Buscar | Filtros */}
      <div className="p-3 border-b border-border flex-shrink-0 space-y-2">
        {/* Channel Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
              {selectedChannelId === "all" ? (
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">ALL</span>
                </div>
              ) : selectedChannel?.avatar ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={selectedChannel.avatar} alt={selectedChannel.name} />
                  <AvatarFallback>
                    <WhatsAppIcon className="h-4 w-4 text-green-500" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-9 w-9 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon className="h-4 w-4 text-green-500" />
                </div>
              )}
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm truncate">
                  {selectedChannelId === "all" ? "Todos os canais" : selectedChannel?.name || "Selecione"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedChannelId === "all"
                    ? `${channels.length} canais${totalUnread > 0 ? ` • ${totalUnread} não lidas` : ""}`
                    : selectedChannel?.phoneNumber || ""}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel>Selecionar canal</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSelectChannel("all")} className="flex items-center gap-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">ALL</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Todos os canais</p>
                <p className="text-xs text-muted-foreground">{channels.length} canais</p>
              </div>
              {totalUnread > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {totalUnread}
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {channels.map((channel) => (
              <DropdownMenuItem
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className="flex items-center gap-3 py-2"
              >
                <div className="relative">
                  {channel.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback>
                        <WhatsAppIcon className="h-4 w-4 text-green-500" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <WhatsAppIcon className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                      channel.status === "connected"
                        ? "bg-green-500"
                        : channel.status === "connecting"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{channel.name}</p>
                  {channel.phoneNumber && (
                    <p className="text-xs text-muted-foreground">{channel.phoneNumber}</p>
                  )}
                </div>
                {channel.unreadCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    {channel.unreadCount}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* List view: Todas | Arquivadas | Fixadas (Fase C) */}
        {onListViewChange && (
          <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
            {(["all", "archived", "pinned"] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => onListViewChange(view)}
                className={cn(
                  "flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors",
                  listView === view
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {view === "all" ? "Todas" : view === "archived" ? "Arquivadas" : "Fixadas"}
              </button>
            ))}
          </div>
        )}

        {/* Editar etiquetas da conversa selecionada */}
        {selectedConversationId && onUpdateConversationLabels && (
          <Popover open={labelsPopoverOpen} onOpenChange={setLabelsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs"
                title="Editar etiquetas da conversa"
              >
                <Tag className="h-3.5 w-3.5" />
                Etiquetas
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-0" sideOffset={4}>
              <div className="p-3 border-b border-border">
                <h4 className="font-semibold text-sm">Etiquetas da conversa</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Selecione as etiquetas e clique em Aplicar.
                </p>
              </div>
              <div className="p-3 space-y-1 max-h-48 overflow-y-auto">
                {inboxLabelOptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">Nenhuma etiqueta no canal. Conecte o WhatsApp para sincronizar.</p>
                ) : (
                  inboxLabelOptions.map((label) => (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => toggleLabelsEditDraft(label.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                        labelsEditDraft.includes(label.id)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full flex-shrink-0", label.colorClass)} />
                      <span className="flex-1 text-left">{label.name}</span>
                      {labelsEditDraft.includes(label.id) && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="p-3 flex justify-end gap-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLabelsPopoverOpen(false)}
                  disabled={labelsEditSaving}
                >
                  Cancelar
                </Button>
                <Button size="sm" onClick={applyLabelsEdit} disabled={labelsEditSaving}>
                  {labelsEditSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Aplicar"
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Search + Filter row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="pl-8 pr-8 h-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Filter dropdown */}
          <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative flex-shrink-0">
                <Button
                  variant={hasActiveFilters ? "secondary" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  title="Filtros"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                {hasActiveFilters && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                    {(activeTab !== "all" ? 1 : 0) + selectedLabels.length}
                  </span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-0" sideOffset={4}>
              <div className="p-3 border-b border-border">
                <h4 className="font-semibold text-sm">Filtros</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Selecione status e etiquetas, depois aplique.
                </p>
              </div>

              {/* Status */}
              <div className="p-3 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setDraftStatus(tab.value)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                        draftStatus === tab.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Etiquetas */}
              <div className="p-3 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Etiquetas</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {inboxLabelOptions.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-1">Nenhuma etiqueta no canal.</p>
                  ) : (
                    inboxLabelOptions.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => toggleDraftLabel(label.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                          draftLabels.includes(label.id)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        <span className={cn("h-2 w-2 rounded-full flex-shrink-0", label.colorClass)} />
                        <span className="flex-1 text-left">{label.name}</span>
                        {draftLabels.includes(label.id) && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={cancelFilters}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Summary + clear filters when active */}
      <div className="px-3 py-1.5 border-b border-border flex items-center justify-between flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          {filteredConversations.length} conversas
          {unreadCount > 0 && ` • ${unreadCount} não lidas`}
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhuma conversa encontrada</p>
            <p className="text-sm mt-1">
              {hasActiveFilters
                ? "Tente ajustar os filtros"
                : "As conversas aparecerão aqui"}
            </p>
          </div>
        ) : (
          <>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                labelMap={labelMap}
              />
            ))}
            {hasMoreConversations && onLoadMoreConversations && (
              <div className="p-3 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onLoadMoreConversations()}
                  disabled={isLoadingMoreConversations}
                >
                  {isLoadingMoreConversations ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    "Carregar mais conversas"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </ScrollArea>
    </div>
  );
}
