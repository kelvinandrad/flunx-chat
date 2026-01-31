import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Video, 
  MessageCircle, 
  Clock, 
  CalendarDays,
  Bot,
  Eye,
  RefreshCw,
  XCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

const events = [
  { id: 1, type: "meeting", title: "Reunião Comercial - Empresa ABC", people: ["João Silva", "Maria Santos"], responsible: "Ana Costa", date: "Hoje, 14:00", status: "confirmed", aiManaged: false, nextStep: "Enviar proposta" },
  { id: 2, type: "followup", title: "Follow-up Proposta XYZ", people: ["Pedro Oliveira"], responsible: "IA", date: "Hoje, 15:30", status: "pending", aiManaged: true, nextStep: "Aguardando resposta" },
  { id: 3, type: "deadline", title: "Prazo: Entrega de Contrato", people: ["Cliente Delta"], responsible: "Carlos Lima", date: "Amanhã, 18:00", status: "pending", aiManaged: false, nextStep: "Finalizar documento" },
  { id: 4, type: "meeting", title: "Demo de Produto", people: ["Empresa Gama"], responsible: "Ana Costa", date: "23 Jan, 10:00", status: "confirmed", aiManaged: false, nextStep: "Preparar ambiente" },
  { id: 5, type: "followup", title: "Retorno sobre Interesse", people: ["Lead Beta"], responsible: "IA", date: "23 Jan, 14:00", status: "pending", aiManaged: true, nextStep: "Confirmar interesse" },
  { id: 6, type: "meeting", title: "Kick-off Projeto Epsilon", people: ["Time Interno", "Cliente"], responsible: "João Silva", date: "24 Jan, 09:00", status: "not_confirmed", aiManaged: false, nextStep: "Confirmar participantes" },
];

const eventTypes = {
  meeting: { label: "Reunião", icon: Video, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  followup: { label: "Follow-up", icon: MessageCircle, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  deadline: { label: "Prazo", icon: Clock, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const statusLabels = {
  confirmed: { label: "Confirmado", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  not_confirmed: { label: "Não Confirmado", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function AllEvents() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Todos os Eventos</h1>
            <p className="text-muted-foreground">Gerencie todos os eventos, follow-ups e prazos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="meeting">Reuniões</SelectItem>
                  <SelectItem value="followup">Follow-ups</SelectItem>
                  <SelectItem value="deadline">Prazos</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="not_confirmed">Não confirmados</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="7d">
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7d">Próximos 7 dias</SelectItem>
                  <SelectItem value="30d">Próximos 30 dias</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Mais Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-muted-foreground">Evento</TableHead>
                  <TableHead className="text-muted-foreground">Pessoa(s)</TableHead>
                  <TableHead className="text-muted-foreground">Responsável</TableHead>
                  <TableHead className="text-muted-foreground">Data / Janela</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Próximo Passo</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const typeConfig = eventTypes[event.type as keyof typeof eventTypes];
                  const statusConfig = statusLabels[event.status as keyof typeof statusLabels];
                  const TypeIcon = typeConfig.icon;

                  return (
                    <TableRow key={event.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="secondary" className={typeConfig.color}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{event.title}</span>
                          {event.aiManaged && (
                            <Badge variant="outline" className="border-violet-300 text-violet-600 dark:border-violet-700 dark:text-violet-400">
                              <Bot className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.people.join(", ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {event.responsible === "IA" ? (
                            <Badge variant="outline" className="border-violet-300 text-violet-600 dark:border-violet-700 dark:text-violet-400">
                              <Bot className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          ) : (
                            <span className="text-foreground">{event.responsible}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {event.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {event.nextStep}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Abrir evento
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reagendar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Converter tipo
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Delegar para IA
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
