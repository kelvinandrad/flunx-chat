import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data
const MOCK_INBOXES = [
  { id: "1", name: "WhatsApp Principal", channel: "whatsapp", status: "connected", conversations: 12 },
  { id: "2", name: "WhatsApp Suporte", channel: "whatsapp", status: "connected", conversations: 5 },
  { id: "3", name: "Email", channel: "email", status: "pending", conversations: 0 },
  { id: "4", name: "Instagram", channel: "instagram", status: "disconnected", conversations: 0 },
];

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  instagram: "Instagram",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  connected: "default",
  pending: "secondary",
  disconnected: "destructive",
};

const InboxList = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Inboxes</h1>
            <p className="text-muted-foreground mt-1">Canais de comunicação configurados</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Inbox
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_INBOXES.map((inbox) => (
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
                <Badge variant={statusColors[inbox.status]}>{inbox.status}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>{channelLabels[inbox.channel]}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  {inbox.conversations} conversa{inbox.conversations !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">* Mock: dados de demonstração</p>
      </div>
    </AppLayout>
  );
};

export default InboxList;
