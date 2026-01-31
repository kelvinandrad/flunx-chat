import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  User,
  Mail,
  MessageSquare,
  Phone,
  MousePointer,
  CreditCard,
  ArrowRight,
  Clock,
  Calendar,
  ChevronDown,
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyEvent {
  id: string;
  type: "email" | "visit" | "chat" | "call" | "conversion" | "click";
  label: string;
  timestamp: string;
  duration?: string;
  details?: string;
}

interface PersonJourney {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  funnel: string;
  currentStage: string;
  events: JourneyEvent[];
  totalDuration: string;
  conversions: number;
}

const journeys: PersonJourney[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    funnel: "Funil de Aquisição",
    currentStage: "Proposta",
    totalDuration: "12 dias",
    conversions: 2,
    events: [
      { id: "e1", type: "visit", label: "Visita ao Site", timestamp: "15 Jan, 10:24", duration: "4min" },
      { id: "e2", type: "click", label: "Clique no CTA", timestamp: "15 Jan, 10:28" },
      { id: "e3", type: "email", label: "Email de Boas-vindas", timestamp: "15 Jan, 10:30" },
      { id: "e4", type: "visit", label: "Acesso ao Blog", timestamp: "16 Jan, 14:15", duration: "8min" },
      { id: "e5", type: "chat", label: "Conversa com IA", timestamp: "17 Jan, 09:00", duration: "12min" },
      { id: "e6", type: "call", label: "Ligação Comercial", timestamp: "18 Jan, 11:30", duration: "25min" },
      { id: "e7", type: "conversion", label: "Cadastro Trial", timestamp: "18 Jan, 12:00" },
    ],
  },
  {
    id: "2",
    name: "Carlos Mendes",
    email: "carlos@empresa.com",
    funnel: "Funil de Aquisição",
    currentStage: "Conversão",
    totalDuration: "8 dias",
    conversions: 3,
    events: [
      { id: "e1", type: "email", label: "Campanha Email", timestamp: "10 Jan, 08:00" },
      { id: "e2", type: "visit", label: "Visita Landing Page", timestamp: "10 Jan, 09:15", duration: "6min" },
      { id: "e3", type: "chat", label: "Chat ao Vivo", timestamp: "10 Jan, 09:20", duration: "15min" },
      { id: "e4", type: "conversion", label: "Download E-book", timestamp: "10 Jan, 09:35" },
      { id: "e5", type: "call", label: "Demo Agendada", timestamp: "12 Jan, 14:00", duration: "45min" },
      { id: "e6", type: "conversion", label: "Assinatura Premium", timestamp: "18 Jan, 16:00" },
    ],
  },
  {
    id: "3",
    name: "Mariana Costa",
    email: "mariana@startup.io",
    funnel: "Funil de Upsell",
    currentStage: "Qualificação",
    totalDuration: "5 dias",
    conversions: 1,
    events: [
      { id: "e1", type: "visit", label: "Acesso Dashboard", timestamp: "20 Jan, 10:00", duration: "30min" },
      { id: "e2", type: "click", label: "Explorou Recursos Pro", timestamp: "20 Jan, 10:25" },
      { id: "e3", type: "email", label: "Email Upsell", timestamp: "21 Jan, 09:00" },
      { id: "e4", type: "chat", label: "Suporte Premium", timestamp: "22 Jan, 15:30", duration: "20min" },
    ],
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "email": return Mail;
    case "visit": return MousePointer;
    case "chat": return MessageSquare;
    case "call": return Phone;
    case "conversion": return CreditCard;
    case "click": return MousePointer;
    default: return ArrowRight;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "email": return "bg-blue-500";
    case "visit": return "bg-purple-500";
    case "chat": return "bg-green-500";
    case "call": return "bg-amber-500";
    case "conversion": return "bg-primary";
    case "click": return "bg-indigo-500";
    default: return "bg-muted";
  }
};

export default function Journeys() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Jornadas</h1>
            <p className="text-muted-foreground mt-1">
              Visualize a trajetória completa de cada pessoa no sistema
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar pessoa..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Funil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os funis</SelectItem>
                  <SelectItem value="acquisition">Funil de Aquisição</SelectItem>
                  <SelectItem value="upsell">Funil de Upsell</SelectItem>
                  <SelectItem value="onboarding">Funil de Onboarding</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os segmentos</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="mid">Mid-Market</SelectItem>
                  <SelectItem value="smb">SMB</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="7d">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Journeys List */}
        <div className="space-y-4">
          {journeys.map((journey) => (
            <Card key={journey.id} className="bg-card border-border overflow-hidden">
              {/* Journey Header */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{journey.name}</h3>
                      <p className="text-sm text-muted-foreground">{journey.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Funil</p>
                      <p className="text-sm font-medium text-foreground">{journey.funnel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Etapa Atual</p>
                      <Badge variant="outline">{journey.currentStage}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Duração</p>
                      <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {journey.totalDuration}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Conversões</p>
                      <p className="text-sm font-medium text-primary">{journey.conversions}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronDown className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <CardContent className="p-6">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                  
                  {/* Events */}
                  <div className="relative flex items-start justify-between">
                    {journey.events.map((event, index) => {
                      const Icon = getEventIcon(event.type);
                      return (
                        <div
                          key={event.id}
                          className="flex flex-col items-center group"
                          style={{ flex: 1 }}
                        >
                          {/* Event Node */}
                          <div
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 z-10",
                              getEventColor(event.type)
                            )}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          
                          {/* Event Details */}
                          <div className="mt-3 text-center max-w-[100px]">
                            <p className="text-xs font-medium text-foreground truncate">
                              {event.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {event.timestamp}
                            </p>
                            {event.duration && (
                              <p className="text-[10px] text-muted-foreground">
                                {event.duration}
                              </p>
                            )}
                          </div>
                          
                          {/* Connector Arrow */}
                          {index < journey.events.length - 1 && (
                            <div className="absolute top-4 hidden group-hover:block" style={{ left: `${((index + 1) / journey.events.length) * 100 - 3}%` }}>
                              <ArrowRight className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
