import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChannelSidebar } from "@/pages/chat/components/ChannelSidebar";
import { useChannels } from "@/hooks/useChannels";
import { useContacts } from "@/hooks/useContacts";
import type { Channel } from "@/pages/chat/components/ConversationListPanel";
import type { ContactListItem } from "@/lib/chat-api-types";
import { Search, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function mapInboxToChannel(inbox: {
  id: string;
  name: string;
  channel_type: string;
  connection_status: string;
  whatsapp_phone_number?: string | null;
}): Channel {
  const status =
    inbox.connection_status === "connected"
      ? "connected"
      : inbox.connection_status === "pending"
        ? "connecting"
        : "disconnected";
  return {
    id: inbox.id,
    name: inbox.name,
    type: (inbox.channel_type as Channel["type"]) || "whatsapp",
    phoneNumber: inbox.whatsapp_phone_number ?? undefined,
    unreadCount: 0,
    status,
  };
}

function formatJidForDisplay(jid: string | null): string {
  if (!jid) return "";
  const num = jid.replace(/@.*$/, "").replace(/^55/, "");
  if (num.length === 11) return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
  if (num.length === 10) return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
  return num || jid;
}

function ContactRow({ contact }: { contact: ContactListItem }) {
  const name = contact.name || contact.remote_jid || "Sem nome";
  const isGroup = contact.contact_type === "group";

  return (
    <div className="flex items-center gap-3 p-3 border-b border-border/50 hover:bg-muted/50 transition-colors">
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={contact.avatar_url ?? undefined} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {isGroup ? (
            <Users className="h-6 w-6 text-primary" />
          ) : (
            name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isGroup && <Users className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
          <span className="font-medium truncate">{name}</span>
        </div>
        {contact.remote_jid && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {formatJidForDisplay(contact.remote_jid)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ContatosPage() {
  const [searchParams] = useSearchParams();
  const channelFromUrl = searchParams.get("channel");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    channelFromUrl || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { channels: inboxes } = useChannels();
  const channels: Channel[] = inboxes.map(mapInboxToChannel);

  const inboxIdForContacts =
    selectedChannelId && selectedChannelId !== "all" ? selectedChannelId : null;
  const {
    contacts,
    isLoading,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useContacts(inboxIdForContacts);

  const filteredContacts = searchQuery
    ? contacts.filter((c) => {
        const q = searchQuery.toLowerCase();
        const name = (c.name || "").toLowerCase();
        const jid = (c.remote_jid || "").toLowerCase();
        return name.includes(q) || jid.includes(q);
      })
    : contacts;

  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <ChannelSidebar
          channels={channels}
          selectedChannelId={selectedChannelId}
          onSelectChannel={setSelectedChannelId}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Header: canal + busca */}
          <div className="h-14 px-4 flex items-center gap-3 border-b border-border flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                Contatos
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {selectedChannelId === "all"
                  ? "Selecione um canal"
                  : selectedChannel
                    ? selectedChannel.name
                    : ""}
              </p>
            </div>
            <div className="relative w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-h-0 flex flex-col">
            {!inboxIdForContacts ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Selecione um canal à esquerda para ver os contatos.</p>
              </div>
            ) : isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>
                  {searchQuery
                    ? "Nenhum contato encontrado para essa busca."
                    : "Nenhum contato neste canal. Use Sincronizar no canal para importar contatos."}
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1">
                  <div className="px-2">
                    <p className="text-xs text-muted-foreground py-2 px-1">
                      {filteredContacts.length} contato{filteredContacts.length !== 1 ? "s" : ""}
                    </p>
                    {filteredContacts.map((contact) => (
                      <ContactRow key={contact.id} contact={contact} />
                    ))}
                  </div>
                </ScrollArea>
                {hasMore && (
                  <div className="p-3 border-t border-border flex-shrink-0">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => loadMore()}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Carregar mais contatos
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
