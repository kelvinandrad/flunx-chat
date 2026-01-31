import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Tag,
  MessageSquare,
  Sparkles,
  Settings
} from "lucide-react";

const agentOffers = [
  {
    id: 1,
    agent: "Vendas AI",
    offers: [
      { name: "Enterprise Anual", priority: 1, arguments: 5, success: 34 },
      { name: "Professional Mensal", priority: 2, arguments: 3, success: 28 },
      { name: "Consultoria Express", priority: 3, arguments: 4, success: 22 },
    ]
  },
  {
    id: 2,
    agent: "Suporte AI",
    offers: [
      { name: "Suporte Premium", priority: 1, arguments: 3, success: 45 },
      { name: "Treinamento Adicional", priority: 2, arguments: 2, success: 18 },
    ]
  },
  {
    id: 3,
    agent: "Agendamento AI",
    offers: [
      { name: "Consultoria de Implementação", priority: 1, arguments: 4, success: 67 },
      { name: "Setup Premium", priority: 2, arguments: 3, success: 42 },
    ]
  },
];

const mainArguments = [
  {
    offer: "Enterprise Anual",
    arguments: [
      "ROI médio de 300% em 6 meses",
      "Suporte 24/7 dedicado incluído",
      "Integração com +50 ferramentas",
      "Economia de 20% vs mensal",
      "Onboarding personalizado gratuito"
    ]
  },
  {
    offer: "Consultoria Express",
    arguments: [
      "Implementação em 5 dias úteis",
      "Equipe certificada e experiente",
      "Garantia de satisfação",
      "Treinamento da equipe incluído"
    ]
  },
];

export default function AIIntegration() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integração com IA</h1>
            <p className="text-muted-foreground mt-1">
              Configure como agentes de IA conhecem e vendem suas ofertas
            </p>
          </div>
        </div>

        {/* Agent-Offer Mapping */}
        <div className="space-y-6">
          {agentOffers.map((agent) => (
            <Card key={agent.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.agent}</CardTitle>
                      <CardDescription>{agent.offers.length} ofertas configuradas</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configurar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agent.offers.map((offer, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                          {offer.priority}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{offer.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {offer.arguments} argumentos
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{offer.success}%</p>
                          <p className="text-xs text-muted-foreground">sucesso</p>
                        </div>
                        <Progress value={offer.success} className="w-24 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Arguments */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Argumentação Principal por Oferta
            </CardTitle>
            <CardDescription>
              Principais argumentos que a IA usa para cada oferta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mainArguments.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{item.offer}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                    {item.arguments.map((arg, argIndex) => (
                      <div 
                        key={argIndex}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm"
                      >
                        <span className="text-muted-foreground">•</span>
                        <span className="text-foreground">{arg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">15</p>
                  <p className="text-sm text-muted-foreground">Ofertas com IA ativa</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <p className="text-sm text-muted-foreground">Agentes configurados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">47</p>
                  <p className="text-sm text-muted-foreground">Argumentos ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
