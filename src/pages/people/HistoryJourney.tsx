import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  ShoppingCart,
  Target,
  Bot,
  Mail,
  Phone,
  Globe,
  Zap,
  ArrowRight,
  Clock,
  SlidersHorizontal,
} from "lucide-react";

const mockEvents = [
  {
    id: "1",
    type: "stage_change",
    person: { name: "Ana Carolina Silva", avatar: "" },
    title: "Mudou de etapa",
    description: "Qualificação → Negociação",
    time: "2 horas atrás",
    source: "CRM",
    icon: TrendingUp,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-500/10",
  },
  {
    id: "2",
    type: "conversation",
    person: { name: "Bruno Oliveira", avatar: "" },
    title: "Conversa iniciada via WhatsApp",
    description: "Agente Comercial respondeu dúvidas sobre preços",
    time: "3 horas atrás",
    source: "Comunicação",
    icon: MessageSquare,
    iconColor: "text-green-600",
    iconBg: "bg-green-500/10",
  },
  {
    id: "3",
    type: "conversion",
    person: { name: "Carla Mendes", avatar: "" },
    title: "Conversão: Cliente Ativo",
    description: "Comprou Plano Enterprise",
    time: "5 horas atrás",
    source: "Funis",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: "4",
    type: "ai_action",
    person: { name: "Daniel Costa", avatar: "" },
    title: "IA realizou ação",
    description: "Agente de Suporte classificou ticket como urgente",
    time: "6 horas atrás",
    source: "IA",
    icon: Bot,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-500/10",
  },
  {
    id: "5",
    type: "email",
    person: { name: "Elena Rodrigues", avatar: "" },
    title: "Email enviado",
    description: "Proposta comercial enviada automaticamente",
    time: "8 horas atrás",
    source: "Comunicação",
    icon: Mail,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-500/10",
  },
  {
    id: "6",
    type: "opportunity",
    person: { name: "Fernando Lima", avatar: "" },
    title: "Oportunidade criada",
    description: "Consultoria Técnica - R$ 15.000",
    time: "1 dia atrás",
    source: "CRM",
    icon: Target,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-500/10",
  },
  {
    id: "7",
    type: "form_submission",
    person: { name: "Gabriela Santos", avatar: "" },
    title: "Formulário preenchido",
    description: "Landing Page - Ebook Marketing Digital",
    time: "1 dia atrás",
    source: "Funis",
    icon: Globe,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-500/10",
  },
  {
    id: "8",
    type: "automation",
    person: { name: "Henrique Almeida", avatar: "" },
    title: "Automação executada",
    description: "Sequência de nutrição iniciada",
    time: "2 dias atrás",
    source: "Automações",
    icon: Zap,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-500/10",
  },
];

const eventStats = [
  { label: "Eventos Hoje", value: "847", change: "+12%" },
  { label: "Conversões", value: "23", change: "+8%" },
  { label: "Interações IA", value: "156", change: "+34%" },
  { label: "Mudanças de Etapa", value: "89", change: "+5%" },
];

export default function HistoryJourney() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Histórico & Jornada</h1>
            <p className="text-muted-foreground mt-1">
              Visualize o comportamento e trajetória das pessoas no sistema
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eventStats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por pessoa ou evento..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 flex-wrap">
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="conversion">Conversões</SelectItem>
                      <SelectItem value="stage_change">Mudança de Etapa</SelectItem>
                      <SelectItem value="conversation">Conversas</SelectItem>
                      <SelectItem value="ai_action">Ações da IA</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="funis">Funis</SelectItem>
                      <SelectItem value="comunicacao">Comunicação</SelectItem>
                      <SelectItem value="ia">IA</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Últimos 7 dias</SelectItem>
                      <SelectItem value="month">Últimos 30 dias</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Mais Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="events">Lista de Eventos</TabsTrigger>
          </TabsList>

          {/* Timeline View */}
          <TabsContent value="timeline" className="space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6">
                    {mockEvents.map((event) => {
                      const Icon = event.icon;
                      return (
                        <div key={event.id} className="relative flex items-start gap-4 pl-14">
                          <div
                            className={`absolute left-0 rounded-full p-2.5 ${event.iconBg} border-4 border-background`}
                          >
                            <Icon className={`h-4 w-4 ${event.iconColor}`} />
                          </div>
                          <div className="flex-1 flex items-start justify-between gap-4 bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={event.person.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(event.person.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-sm">{event.person.name}</p>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <p className="text-sm text-foreground">{event.title}</p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <Badge variant="outline" className="text-xs mb-1">
                                {event.source}
                              </Badge>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                  <Button variant="outline">Carregar mais eventos</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events List View */}
          <TabsContent value="events" className="space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`rounded-full p-2 ${event.iconBg}`}>
                            <Icon className={`h-4 w-4 ${event.iconColor}`} />
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={event.person.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(event.person.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.person.name} • {event.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {event.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {event.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Note */}
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Eventos conectados</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Os eventos desta tela se integram automaticamente com Funis & Jornadas, CRM,
                  Comunicação e Traqueamento & Atribuição.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
