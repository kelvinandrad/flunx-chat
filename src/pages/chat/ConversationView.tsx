import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Mock messages
const MOCK_MESSAGES = [
  { id: "m1", sender: "contact", content: "Olá! Preciso de ajuda com meu pedido.", time: "10:30" },
  { id: "m2", sender: "agent", content: "Olá! Claro, em que posso ajudar?", time: "10:31" },
  { id: "m3", sender: "contact", content: "O pedido #1234 ainda não chegou. Qual o prazo?", time: "10:32" },
  { id: "m4", sender: "agent", content: "Verificando... O prazo de entrega é de 5 a 7 dias úteis. Seu pedido foi enviado há 3 dias.", time: "10:33" },
  { id: "m5", sender: "contact", content: "Entendido, obrigado!", time: "10:35" },
];

const ConversationView = () => {
  const navigate = useNavigate();
  const { inboxId, conversationId } = useParams();
  const contactName = "João Silva"; // Mock

  return (
    <AppLayout>
      <div className="animate-fade-in h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/inboxes/${inboxId}/conversations`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{contactName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{contactName}</h1>
              <p className="text-sm text-muted-foreground">WhatsApp • Online</p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <Card className="flex-1 min-h-0 flex flex-col">
          <CardHeader className="border-b py-3">
            <p className="text-sm text-muted-foreground">Conversa #{conversationId} • Mock</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {MOCK_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.sender === "agent"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4 flex gap-2">
              <Input placeholder="Digite sua mensagem..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-2">* Mock: interface de demonstração</p>
      </div>
    </AppLayout>
  );
};

export default ConversationView;
