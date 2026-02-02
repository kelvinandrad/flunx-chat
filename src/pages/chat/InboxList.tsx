import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChannels } from "@/hooks/useChannels";

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  webchat: "Web Chat",
};

const statusLabels: Record<string, string> = {
  connected: "Conectado",
  pending: "Pendente",
  disconnected: "Desconectado",
  error: "Erro",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  connected: "default",
  pending: "secondary",
  disconnected: "destructive",
  error: "destructive",
};

const InboxList = () => {
  const navigate = useNavigate();
  const { channels, isLoading, error } = useChannels();

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Inboxes</h1>
            <p className="text-muted-foreground mt-1">Canais de comunicação configurados</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/canais")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo canal
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {channels.length === 0 ? (
              <p className="col-span-full text-sm text-muted-foreground py-8">
                Nenhum canal configurado. Crie um canal em Canais para começar.
              </p>
            ) : (
              channels.map((inbox) => (
                <Card
                  key={inbox.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => navigate(`/inboxes/${inbox.id}/conversations`)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{inbox.name}</CardTitle>
                    </div>
                    <Badge variant={statusVariants[inbox.connection_status] ?? "outline"}>
                      {statusLabels[inbox.connection_status] ?? inbox.connection_status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {channelLabels[inbox.channel_type] ?? inbox.channel_type}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">
                      {inbox.conversations_count ?? 0} conversa
                      {(inbox.conversations_count ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default InboxList;
