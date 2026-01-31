import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Video,
  MessageCircle,
  Clock,
  CheckCircle,
  Bot,
  Settings,
  Edit,
  Trash2
} from "lucide-react";

const eventTypes = [
  {
    id: 1,
    name: "Reunião Comercial",
    icon: Video,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    hasTime: true,
    defaultDuration: "1h",
    aiCanAct: true,
    createsGoogleMeet: true,
    description: "Reuniões com clientes ou prospects",
    usage: 156,
  },
  {
    id: 2,
    name: "Follow-up",
    icon: MessageCircle,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    hasTime: false,
    defaultDuration: null,
    aiCanAct: true,
    createsGoogleMeet: false,
    description: "Acompanhamentos e retornos",
    usage: 234,
  },
  {
    id: 3,
    name: "Prazo Interno",
    icon: Clock,
    color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    hasTime: true,
    defaultDuration: null,
    aiCanAct: false,
    createsGoogleMeet: false,
    description: "Deadlines e entregas internas",
    usage: 89,
  },
  {
    id: 4,
    name: "Confirmação",
    icon: CheckCircle,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    hasTime: false,
    defaultDuration: null,
    aiCanAct: true,
    createsGoogleMeet: false,
    description: "Aguardando confirmação de cliente",
    usage: 112,
  },
  {
    id: 5,
    name: "Demo de Produto",
    icon: Video,
    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
    hasTime: true,
    defaultDuration: "45min",
    aiCanAct: true,
    createsGoogleMeet: true,
    description: "Demonstrações de produto para prospects",
    usage: 67,
  },
  {
    id: 6,
    name: "Onboarding",
    icon: Video,
    color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    hasTime: true,
    defaultDuration: "2h",
    aiCanAct: false,
    createsGoogleMeet: true,
    description: "Reunião inicial com novos clientes",
    usage: 23,
  },
];

export default function EventTypes() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tipos de Evento</h1>
            <p className="text-muted-foreground">Configure tipos de eventos e suas propriedades</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Tipo
          </Button>
        </div>

        {/* Event Types Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((eventType) => (
            <Card key={eventType.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${eventType.color}`}>
                        <eventType.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{eventType.name}</h3>
                        <p className="text-sm text-muted-foreground">{eventType.usage} usos</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{eventType.description}</p>
                  
                  {/* Properties */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Possui horário</span>
                      <div className="flex items-center gap-2">
                        {eventType.hasTime ? (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </div>
                    </div>
                    
                    {eventType.defaultDuration && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duração padrão</span>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {eventType.defaultDuration}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">IA pode agir</span>
                      <div className="flex items-center gap-2">
                        {eventType.aiCanAct ? (
                          <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                            <Bot className="h-3 w-3 mr-1" />
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cria Google Meet</span>
                      <div className="flex items-center gap-2">
                        {eventType.createsGoogleMeet ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <Video className="h-3 w-3 mr-1" />
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Properties Legend */}
        <Card className="bg-muted/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Propriedades dos Tipos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-foreground" />
                  <span className="font-medium text-foreground">Possui horário</span>
                </div>
                <p className="text-muted-foreground">Define se o evento tem hora marcada ou é apenas uma tarefa com data</p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-foreground" />
                  <span className="font-medium text-foreground">Duração padrão</span>
                </div>
                <p className="text-muted-foreground">Duração sugerida ao criar eventos deste tipo</p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4 text-violet-500" />
                  <span className="font-medium text-foreground">IA pode agir</span>
                </div>
                <p className="text-muted-foreground">IA pode criar, reagendar ou gerenciar automaticamente</p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Video className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-foreground">Cria Google Meet</span>
                </div>
                <p className="text-muted-foreground">Gera link de videoconferência automaticamente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
