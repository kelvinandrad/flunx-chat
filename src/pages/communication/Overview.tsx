import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Bot, 
  Plug, 
  Zap, 
  Clock, 
  AlertTriangle, 
  User,
  ArrowRight,
  Activity
} from "lucide-react";

const metrics = [
  { label: "Conversas Ativas", value: "247", icon: MessageSquare, change: "+12%", trend: "up" },
  { label: "Agentes Ativos", value: "8", icon: Bot, change: "100%", trend: "neutral" },
  { label: "Canais Conectados", value: "4", icon: Plug, change: "+1", trend: "up" },
  { label: "Automações em Execução", value: "23", icon: Zap, change: "+5", trend: "up" },
];

const recentConversations = [
  { id: 1, person: "Ana Costa", channel: "WhatsApp", agent: "Vendas AI", status: "active", lastMessage: "Qual o prazo de entrega?", time: "2 min" },
  { id: 2, person: "Carlos Silva", channel: "Email", agent: "Suporte AI", status: "active", lastMessage: "Preciso de ajuda com...", time: "5 min" },
  { id: 3, person: "Maria Santos", channel: "Webchat", agent: "Orquestrador", status: "waiting", lastMessage: "Gostaria de saber mais...", time: "8 min" },
  { id: 4, person: "João Oliveira", channel: "Instagram", agent: "Agendamento AI", status: "active", lastMessage: "Posso agendar para...", time: "12 min" },
  { id: 5, person: "Fernanda Lima", channel: "WhatsApp", agent: "Vendas AI", status: "resolved", lastMessage: "Obrigado pela ajuda!", time: "15 min" },
];

const systemAlerts = [
  { id: 1, type: "warning", title: "Fallback para Humano", description: "3 conversas aguardando atendimento humano", time: "agora" },
  { id: 2, type: "error", title: "Erro de Agente", description: "Agente Suporte AI não conseguiu responder", time: "5 min" },
  { id: 3, type: "info", title: "Alta Demanda", description: "Volume de mensagens 40% acima da média", time: "10 min" },
];

export default function Overview() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Cockpit de Comunicação</h1>
          <p className="text-muted-foreground mt-1">
            Visão operacional em tempo real de todos os canais e agentes de IA
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                      <p className={`text-xs font-medium ${metric.trend === 'up' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        {metric.change} vs. ontem
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Conversations */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Últimas Conversas</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Ver todas <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentConversations.map((conv) => (
                    <div key={conv.id} className="px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{conv.person}</span>
                            <Badge variant="outline" className="text-xs">{conv.channel}</Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                conv.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                                conv.status === 'waiting' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-muted text-muted-foreground'
                              }`}
                            >
                              {conv.status === 'active' ? 'Ativo' : conv.status === 'waiting' ? 'Aguardando' : 'Resolvido'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{conv.time}</p>
                          <p className="text-xs text-primary mt-1">{conv.agent}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <div>
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Alertas do Sistema</CardTitle>
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border ${
                      alert.type === 'error' ? 'border-destructive/50 bg-destructive/5' :
                      alert.type === 'warning' ? 'border-amber-500/50 bg-amber-500/5' :
                      'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${
                        alert.type === 'error' ? 'text-destructive' :
                        alert.type === 'warning' ? 'text-amber-500' :
                        'text-muted-foreground'
                      }`}>
                        {alert.type === 'error' ? <AlertTriangle className="h-4 w-4" /> :
                         alert.type === 'warning' ? <Clock className="h-4 w-4" /> :
                         <Activity className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Real-time Activity Strip */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">Sistema Operando</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-6 text-sm text-muted-foreground animate-fade-in">
                  <span><strong className="text-foreground">34</strong> mensagens/min</span>
                  <span><strong className="text-foreground">2.3s</strong> tempo médio de resposta</span>
                  <span><strong className="text-foreground">94%</strong> resoluções automáticas</span>
                  <span><strong className="text-foreground">6</strong> conversas em fallback</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
