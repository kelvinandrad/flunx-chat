import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Inbox, MessageCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Flunx Chat</h1>
          <p className="text-muted-foreground mt-1">Gestão de canais e conversas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Conversas Abertas"
            value="17"
            change="+5 hoje"
            changeType="positive"
            icon={MessageCircle}
          />
          <StatsCard
            title="Inboxes Ativos"
            value="2"
            change="WhatsApp conectado"
            changeType="neutral"
            icon={Inbox}
          />
          <StatsCard
            title="Mensagens Hoje"
            value="42"
            change="+12 vs ontem"
            changeType="positive"
            icon={MessageSquare}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Começar</CardTitle>
            <CardDescription>Acesse o chat para gerenciar as conversas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/chat")}>
              Ir para Chat
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-6">* Mock: dados de demonstração</p>
      </div>
    </AppLayout>
  );
};

export default Index;
