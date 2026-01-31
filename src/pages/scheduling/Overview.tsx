import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Clock, 
  MessageCircle, 
  Bot, 
  AlertTriangle,
  ArrowRight,
  Video,
  Plus
} from "lucide-react";

const kpiCards = [
  { title: "Eventos Hoje", value: "12", change: "+3 vs ontem", icon: CalendarDays, color: "text-blue-500" },
  { title: "Próximos 7 Dias", value: "47", change: "23 reuniões", icon: Clock, color: "text-emerald-500" },
  { title: "Follow-ups Pendentes", value: "8", change: "3 atrasados", icon: MessageCircle, color: "text-amber-500" },
  { title: "Eventos Gerenciados por IA", value: "15", change: "32% do total", icon: Bot, color: "text-violet-500" },
];

const timelineEvents = [
  { time: "Agora", title: "Reunião com Empresa ABC", type: "meeting", status: "in_progress", participants: ["João Silva", "Maria Santos"] },
  { time: "14:00", title: "Follow-up - Proposta XYZ", type: "followup", status: "pending", aiManaged: true },
  { time: "15:30", title: "Demo de Produto", type: "meeting", status: "confirmed", participants: ["Pedro Costa"] },
  { time: "16:00", title: "Prazo: Enviar Contrato", type: "deadline", status: "pending" },
  { time: "17:00", title: "Call de Fechamento", type: "meeting", status: "pending", participants: ["Ana Oliveira"] },
];

const alerts = [
  { type: "warning", message: "3 eventos não confirmados", action: "Confirmar agora" },
  { type: "conflict", message: "Conflito de agenda às 15:00", action: "Resolver" },
  { type: "overdue", message: "2 follow-ups atrasados", action: "Ver pendências" },
];

const upcomingEvents = [
  { date: "Amanhã", events: [
    { time: "09:00", title: "Kick-off Projeto Delta", type: "meeting" },
    { time: "11:00", title: "Follow-up Negociação", type: "followup" },
    { time: "14:00", title: "Apresentação Comercial", type: "meeting" },
  ]},
  { date: "Quinta-feira", events: [
    { time: "10:00", title: "Revisão de Pipeline", type: "meeting" },
    { time: "15:00", title: "Prazo: Proposta Final", type: "deadline" },
  ]},
];

export default function SchedulingOverview() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">Visão geral de eventos, follow-ups e próximos passos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{kpi.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{kpi.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-muted ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timeline */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-muted-foreground w-14">{event.time}</span>
                    </div>
                    <div className="flex-1 border-l-2 border-border pl-4 pb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{event.title}</span>
                        {event.type === "meeting" && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <Video className="h-3 w-3 mr-1" />
                            Reunião
                          </Badge>
                        )}
                        {event.type === "followup" && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Follow-up
                          </Badge>
                        )}
                        {event.type === "deadline" && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <Clock className="h-3 w-3 mr-1" />
                            Prazo
                          </Badge>
                        )}
                        {event.aiManaged && (
                          <Badge variant="outline" className="border-violet-300 text-violet-600 dark:border-violet-700 dark:text-violet-400">
                            <Bot className="h-3 w-3 mr-1" />
                            IA
                          </Badge>
                        )}
                        {event.status === "in_progress" && (
                          <Badge className="bg-emerald-500">Em andamento</Badge>
                        )}
                      </div>
                      {event.participants && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.participants.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Próximos */}
          <div className="space-y-6">
            {/* Alertas */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">{alert.message}</span>
                      <Button variant="ghost" size="sm" className="text-primary">
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Próximos Dias */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((day) => (
                    <div key={day.date}>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2">{day.date}</h4>
                      <div className="space-y-2">
                        {day.events.map((event, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-12">{event.time}</span>
                            <span className="text-foreground flex-1">{event.title}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
