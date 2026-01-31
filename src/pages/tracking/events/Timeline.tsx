import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Globe,
  Mail,
  MousePointer,
} from "lucide-react";
import { useState } from "react";

const people = [
  { id: "1", name: "Maria Silva", email: "maria@empresa.com", avatar: null },
  { id: "2", name: "João Santos", email: "joao@empresa.com", avatar: null },
  { id: "3", name: "Ana Costa", email: "ana@empresa.com", avatar: null },
];

const timelineEvents = [
  {
    id: 1,
    event: "Pagamento Confirmado",
    icon: CreditCard,
    type: "conversion",
    timestamp: "2024-01-20 14:32",
    details: "Plano Pro - R$ 297/mês",
    source: "Pagamentos",
  },
  {
    id: 2,
    event: "Contrato Assinado",
    icon: CheckCircle2,
    type: "conversion",
    timestamp: "2024-01-20 14:28",
    details: "Contrato de Serviço assinado digitalmente",
    source: "Contratos",
  },
  {
    id: 3,
    event: "Reunião Realizada",
    icon: Calendar,
    type: "engagement",
    timestamp: "2024-01-19 10:00",
    details: "Demo do produto - 45 min",
    source: "Agendamentos",
  },
  {
    id: 4,
    event: "Etapa Alterada",
    icon: ArrowRight,
    type: "funnel",
    timestamp: "2024-01-18 16:45",
    details: "Proposta → Negociação",
    source: "Funil de Vendas",
  },
  {
    id: 5,
    event: "Email Aberto",
    icon: Mail,
    type: "engagement",
    timestamp: "2024-01-18 09:12",
    details: "Proposta Comercial - Taxa: 100%",
    source: "Comunicação",
  },
  {
    id: 6,
    event: "Conversa com IA",
    icon: MessageSquare,
    type: "engagement",
    timestamp: "2024-01-17 15:30",
    details: "Agente: Vendas | 12 mensagens",
    source: "Comunicação",
  },
  {
    id: 7,
    event: "Clicou em Preços",
    icon: MousePointer,
    type: "engagement",
    timestamp: "2024-01-17 15:25",
    details: "Página: /precos",
    source: "Website",
  },
  {
    id: 8,
    event: "Lead Criado",
    icon: UserPlus,
    type: "conversion",
    timestamp: "2024-01-17 15:20",
    details: "Origem: Google Ads | Campanha: Black Friday",
    source: "CRM",
  },
  {
    id: 9,
    event: "Primeira Visita",
    icon: Eye,
    type: "acquisition",
    timestamp: "2024-01-17 15:18",
    details: "UTM: google / cpc / black-friday-2024",
    source: "Sistema",
  },
];

const typeColors = {
  conversion: "bg-success/10 text-success border-success/20",
  engagement: "bg-primary/10 text-primary border-primary/20",
  funnel: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  acquisition: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function EventTimeline() {
  const [selectedPerson, setSelectedPerson] = useState("1");
  const person = people.find((p) => p.id === selectedPerson);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Linha do Tempo
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize a jornada completa de uma pessoa
          </p>
        </div>

        {/* Person Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar pessoa..." className="pl-9" />
              </div>

              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Selecionar pessoa" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Person Info + Timeline */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Person Card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-3">
                  <AvatarImage src={person?.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {person?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-foreground">{person?.name}</h3>
                <p className="text-sm text-muted-foreground">{person?.email}</p>

                <div className="w-full mt-4 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Origem</span>
                    <Badge variant="outline">Google Ads</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Funil</span>
                    <span className="font-medium">Vendas</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Etapa</span>
                    <Badge className="bg-success/10 text-success">Cliente</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Eventos</span>
                    <span className="font-medium">{timelineEvents.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Jornada Completa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6">
                  {timelineEvents.map((event, index) => {
                    const Icon = event.icon;
                    const colors =
                      typeColors[event.type as keyof typeof typeColors];

                    return (
                      <div key={event.id} className="relative flex gap-4">
                        {/* Icon */}
                        <div
                          className={`relative z-10 h-12 w-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${colors}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {event.event}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {event.details}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {event.source}
                                </Badge>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {event.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
