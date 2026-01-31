import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

// Mock data
const MOCK_CONVERSATIONS = [
  { id: "c1", contact: "João Silva", preview: "Obrigado pelo atendimento!", status: "open", unread: 2, time: "10:32" },
  { id: "c2", contact: "Maria Santos", preview: "Preciso de ajuda com o pedido", status: "open", unread: 0, time: "09:15" },
  { id: "c3", contact: "Pedro Oliveira", preview: "Qual o prazo de entrega?", status: "resolved", unread: 0, time: "Ontem" },
  { id: "c4", contact: "Ana Costa", preview: "Bom dia! Gostaria de mais informações", status: "pending", unread: 1, time: "Ontem" },
];

const statusLabels: Record<string, string> = {
  open: "Aberto",
  pending: "Pendente",
  resolved: "Resolvido",
};

const ConversationList = () => {
  const navigate = useNavigate();
  const { inboxId } = useParams();
  const inboxName = "WhatsApp Principal"; // Mock

  return (
    <AppLayout>
      <div className="animate-fade-in h-full flex flex-col">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/inboxes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{inboxName}</h1>
            <p className="text-sm text-muted-foreground">Conversas • {MOCK_CONVERSATIONS.length} ativas</p>
          </div>
        </div>

        <Card className="flex-1 min-h-0">
          <CardHeader className="border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Lista de conversas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              {MOCK_CONVERSATIONS.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/inboxes/${inboxId}/conversations/${conv.id}`)}
                >
                  <Avatar>
                    <AvatarFallback>{conv.contact.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{conv.contact}</span>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm text-muted-foreground truncate flex-1">{conv.preview}</p>
                      {conv.unread > 0 && (
                        <Badge variant="default" className="text-xs h-5">{conv.unread}</Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">{statusLabels[conv.status]}</Badge>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-2">* Mock: dados de demonstração</p>
      </div>
    </AppLayout>
  );
};

export default ConversationList;
