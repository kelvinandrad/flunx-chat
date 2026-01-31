import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  MessageSquare,
  Video,
  FileText,
  AlertCircle,
  Calendar,
  User,
  Target,
  ListTodo,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { useActivities, useUpdateActivity } from "@/hooks/useActivities";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";

const typeIcons: Record<string, React.ElementType> = {
  "task": ListTodo,
  "follow_up": Clock,
  "call": PhoneCall,
  "message": MessageSquare,
  "meeting": Video,
};

const typeLabels: Record<string, string> = {
  "task": "Tarefa",
  "follow_up": "Follow-up",
  "call": "Ligação",
  "message": "Mensagem",
  "meeting": "Reunião",
};

const statusColors: Record<string, string> = {
  "completed": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "pending": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "scheduled": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "in_progress": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const statusLabels: Record<string, string> = {
  "completed": "Concluída",
  "pending": "Pendente",
  "scheduled": "Agendada",
  "in_progress": "Em andamento",
};

export default function Activities() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const { data: members = [] } = useOrganizationMembers();
  const { data: activities = [], isLoading } = useActivities({
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchTerm || undefined,
  });
  const updateActivity = useUpdateActivity();

  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.people?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleMarkComplete = (id: string) => {
    updateActivity.mutate({
      id,
      status: "completed",
      completed_at: new Date().toISOString(),
    });
  };

  const stats = {
    total: activities.length,
    pending: activities.filter((a) => a.status === "pending").length,
    completed: activities.filter((a) => a.status === "completed").length,
    scheduled: activities.filter((a) => a.status === "scheduled").length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Atividades</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie tarefas, follow-ups e ações comerciais
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ListTodo className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-semibold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl font-semibold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Agendadas</p>
                  <p className="text-xl font-semibold">{stats.scheduled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                  <p className="text-xl font-semibold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-medium">Lista de Atividades</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar atividade..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Tipos</SelectItem>
                    <SelectItem value="task">Tarefa</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="call">Ligação</SelectItem>
                    <SelectItem value="message">Mensagem</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ListTodo className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Atividade</TableHead>
                      <TableHead>Pessoa</TableHead>
                      <TableHead>Oportunidade</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => {
                      const TypeIcon = typeIcons[activity.type] || ListTodo;
                      return (
                        <TableRow key={activity.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedActivities.includes(activity.id)}
                              onCheckedChange={() => toggleActivity(activity.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span className="text-sm">{typeLabels[activity.type] || activity.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{activity.title}</TableCell>
                          <TableCell>
                            {activity.people ? (
                              <button
                                className="flex items-center gap-1 text-primary hover:underline"
                                onClick={() => navigate(`/pessoas/${activity.person_id}`)}
                              >
                                <User className="h-3.5 w-3.5" />
                                {activity.people.name}
                              </button>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {activity.opportunities ? (
                              <button
                                className="flex items-center gap-1 text-primary hover:underline"
                                onClick={() =>
                                  navigate(`/comercial/oportunidades/${activity.opportunity_id}`)
                                }
                              >
                                <Target className="h-3.5 w-3.5" />
                                {activity.opportunities.name}
                              </button>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {activity.profiles?.full_name || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {activity.due_at
                              ? new Date(activity.due_at).toLocaleDateString("pt-BR")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statusColors[activity.status || "pending"] || ""}
                            >
                              {statusLabels[activity.status || "pending"] || activity.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem onClick={() => handleMarkComplete(activity.id)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Marcar como concluída
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Clock className="mr-2 h-4 w-4" />
                                  Reagendar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
