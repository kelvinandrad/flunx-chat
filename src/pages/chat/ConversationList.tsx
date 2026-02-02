import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { useChannels } from "@/hooks/useChannels";

const statusLabels: Record<string, string> = {
  open: "Aberto",
  pending: "Pendente",
  resolved: "Resolvido",
  snoozed: "Adiado",
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function getInitials(name: string | null): string {
  if (!name || !name.trim()) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const ConversationList = () => {
  const navigate = useNavigate();
  const { inboxId } = useParams();
  const { channels } = useChannels();
  const { conversations, isLoading, error } = useConversations(inboxId);

  const inboxName = inboxId ? channels.find((c) => c.id === inboxId)?.name ?? "Inbox" : "Inbox";

  return (
    <AppLayout>
      <div className="animate-fade-in h-full flex flex-col">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/inboxes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{inboxName}</h1>
            <p className="text-sm text-muted-foreground">
              Conversas • {isLoading ? "..." : conversations.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive mb-4">
            {error.message}
          </div>
        )}

        <Card className="flex-1 min-h-0">
          <CardHeader className="border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Lista de conversas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-280px)]">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Nenhuma conversa neste inbox.
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const contactName = conv.contact?.name ?? conv.contact?.remote_jid ?? "Contato";
                    const time = conv.preview_at ?? conv.updated_at;
                    return (
                      <div
                        key={conv.id}
                        className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() =>
                          navigate(`/inboxes/${inboxId}/conversations/${conv.id}`)
                        }
                      >
                        <Avatar>
                          <AvatarFallback>{getInitials(contactName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{contactName}</span>
                            {time && (
                              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                {formatTime(time)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-sm text-muted-foreground truncate flex-1">
                              {conv.preview ?? "—"}
                            </p>
                          </div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {statusLabels[conv.status] ?? conv.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ConversationList;
