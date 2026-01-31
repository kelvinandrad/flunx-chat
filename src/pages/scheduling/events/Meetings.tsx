import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
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
  Plus, 
  MoreHorizontal, 
  Video, 
  MapPin,
  Bot,
  RefreshCw,
  XCircle,
  CheckCircle,
  ExternalLink,
  Users,
  Clock,
  History
} from "lucide-react";

const meetings = [
  { 
    id: 1, 
    title: "Reunião Comercial - Empresa ABC", 
    type: "online", 
    participants: ["João Silva", "Maria Santos", "Cliente ABC"], 
    location: "Google Meet",
    link: "https://meet.google.com/abc-defg-hij",
    date: "Hoje, 14:00",
    duration: "1h",
    confirmationStatus: "confirmed",
    rescheduleCount: 0
  },
  { 
    id: 2, 
    title: "Demo de Produto", 
    type: "online", 
    participants: ["Ana Costa", "Empresa Beta"], 
    location: "Google Meet",
    link: "https://meet.google.com/xyz-uvwx-abc",
    date: "Amanhã, 10:00",
    duration: "45min",
    confirmationStatus: "pending",
    rescheduleCount: 1
  },
  { 
    id: 3, 
    title: "Kick-off Projeto Delta", 
    type: "presential", 
    participants: ["Time Completo", "Cliente Delta"], 
    location: "Sala de Reuniões A",
    link: null,
    date: "24 Jan, 09:00",
    duration: "2h",
    confirmationStatus: "not_confirmed",
    rescheduleCount: 0
  },
  { 
    id: 4, 
    title: "Alinhamento Interno", 
    type: "online", 
    participants: ["Equipe de Vendas"], 
    location: "Google Meet",
    link: "https://meet.google.com/def-ghij-klm",
    date: "24 Jan, 15:00",
    duration: "30min",
    confirmationStatus: "confirmed",
    rescheduleCount: 0
  },
  { 
    id: 5, 
    title: "Apresentação Final", 
    type: "presential", 
    participants: ["Diretoria", "Cliente Epsilon"], 
    location: "Auditório Principal",
    link: null,
    date: "25 Jan, 14:00",
    duration: "1h30",
    confirmationStatus: "pending",
    rescheduleCount: 2
  },
];

const confirmationLabels = {
  confirmed: { label: "Confirmado", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  not_confirmed: { label: "Não Confirmado", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function Meetings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reuniões</h1>
            <p className="text-muted-foreground">Gestão de reuniões presenciais e online</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Reunião
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar reuniões..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presential">Presencial</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="not_confirmed">Não confirmados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Meetings Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Reunião</TableHead>
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-muted-foreground">Participantes</TableHead>
                  <TableHead className="text-muted-foreground">Local / Link</TableHead>
                  <TableHead className="text-muted-foreground">Data</TableHead>
                  <TableHead className="text-muted-foreground">Confirmação</TableHead>
                  <TableHead className="text-muted-foreground">Reagendamentos</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => {
                  const confirmationConfig = confirmationLabels[meeting.confirmationStatus as keyof typeof confirmationLabels];
                  
                  return (
                    <TableRow key={meeting.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <span className="font-medium text-foreground">{meeting.title}</span>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meeting.duration}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {meeting.type === "online" ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <Video className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            Presencial
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-foreground">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.participants.length}</span>
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                          {meeting.participants.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {meeting.type === "online" ? (
                            <>
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{meeting.location}</span>
                              {meeting.link && (
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{meeting.location}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{meeting.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={confirmationConfig.color}>
                          {confirmationConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {meeting.rescheduleCount > 0 ? (
                          <div className="flex items-center gap-1 text-amber-600">
                            <History className="h-4 w-4" />
                            <span>{meeting.rescheduleCount}x</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {meeting.type === "online" && (
                              <DropdownMenuItem>
                                <Video className="h-4 w-4 mr-2" />
                                Abrir Google Meet
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reagendar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bot className="h-4 w-4 mr-2" />
                              Confirmar via IA
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marcar como confirmado
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
