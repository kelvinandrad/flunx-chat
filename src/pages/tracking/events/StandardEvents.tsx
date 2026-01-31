import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Calendar,
  FileSignature,
  CheckCircle2,
  CreditCard,
  Activity,
} from "lucide-react";

const standardEvents = [
  {
    id: 1,
    name: "Primeira Visita",
    key: "first_visit",
    description: "Quando uma pessoa acessa o site pela primeira vez",
    icon: Eye,
    status: "active",
    origin: "Sistema",
    lastTriggered: "Há 2 minutos",
    count24h: 1245,
  },
  {
    id: 2,
    name: "Conversa Iniciada",
    key: "conversation_started",
    description: "Quando uma conversa é iniciada com um agente ou chat",
    icon: MessageSquare,
    status: "active",
    origin: "Comunicação",
    lastTriggered: "Há 5 minutos",
    count24h: 456,
  },
  {
    id: 3,
    name: "Lead Criado",
    key: "lead_created",
    description: "Quando uma pessoa se torna um lead qualificado",
    icon: UserPlus,
    status: "active",
    origin: "CRM",
    lastTriggered: "Há 8 minutos",
    count24h: 234,
  },
  {
    id: 4,
    name: "Etapa do Funil Alterada",
    key: "funnel_stage_changed",
    description: "Quando uma pessoa avança ou retrocede no funil",
    icon: ArrowRight,
    status: "active",
    origin: "Funis",
    lastTriggered: "Há 3 minutos",
    count24h: 678,
  },
  {
    id: 5,
    name: "Reunião Agendada",
    key: "meeting_scheduled",
    description: "Quando uma reunião é agendada com a pessoa",
    icon: Calendar,
    status: "active",
    origin: "Agendamentos",
    lastTriggered: "Há 15 minutos",
    count24h: 89,
  },
  {
    id: 6,
    name: "Contrato Enviado",
    key: "contract_sent",
    description: "Quando um contrato é enviado para assinatura",
    icon: FileSignature,
    status: "active",
    origin: "Contratos",
    lastTriggered: "Há 1 hora",
    count24h: 45,
  },
  {
    id: 7,
    name: "Contrato Assinado",
    key: "contract_signed",
    description: "Quando a pessoa assina o contrato",
    icon: CheckCircle2,
    status: "active",
    origin: "Contratos",
    lastTriggered: "Há 2 horas",
    count24h: 32,
  },
  {
    id: 8,
    name: "Pagamento Confirmado",
    key: "payment_confirmed",
    description: "Quando um pagamento é confirmado com sucesso",
    icon: CreditCard,
    status: "active",
    origin: "Pagamentos",
    lastTriggered: "Há 30 minutos",
    count24h: 28,
  },
];

export default function StandardEvents() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Eventos Padrão
            </h1>
            <p className="text-sm text-muted-foreground">
              Eventos nativos do sistema rastreados automaticamente
            </p>
          </div>

          <Select defaultValue="24h">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Última hora</SelectItem>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {standardEvents.map((event) => {
            const Icon = event.icon;
            return (
              <Card key={event.id} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-foreground">
                            {event.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <code className="bg-muted px-1.5 py-0.5 rounded">
                              {event.key}
                            </code>
                          </p>
                        </div>
                        <Badge
                          className="bg-success/10 text-success hover:bg-success/20"
                        >
                          Ativo
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {event.origin}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {event.lastTriggered}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-foreground">
                            {event.count24h.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">
                            /24h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
