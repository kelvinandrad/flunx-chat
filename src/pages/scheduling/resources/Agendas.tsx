import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Calendar,
  Clock,
  Settings,
  User,
  CheckCircle,
  XCircle,
  Edit
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "João Silva",
    role: "Vendedor Senior",
    avatar: "JS",
    workHours: { start: "08:00", end: "18:00" },
    workDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    holidays: ["25/12", "01/01", "21/04"],
    simultaneousCapacity: 1,
    status: "available",
    todayEvents: 4,
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "Account Executive",
    avatar: "MS",
    workHours: { start: "09:00", end: "19:00" },
    workDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    holidays: ["25/12", "01/01"],
    simultaneousCapacity: 2,
    status: "busy",
    todayEvents: 6,
  },
  {
    id: 3,
    name: "Ana Costa",
    role: "SDR",
    avatar: "AC",
    workHours: { start: "08:00", end: "17:00" },
    workDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    holidays: ["25/12", "01/01", "15/11"],
    simultaneousCapacity: 1,
    status: "available",
    todayEvents: 3,
  },
  {
    id: 4,
    name: "Carlos Lima",
    role: "Closer",
    avatar: "CL",
    workHours: { start: "10:00", end: "20:00" },
    workDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    holidays: ["25/12", "01/01"],
    simultaneousCapacity: 1,
    status: "offline",
    todayEvents: 0,
  },
  {
    id: 5,
    name: "Pedro Oliveira",
    role: "Vendedor",
    avatar: "PO",
    workHours: { start: "08:00", end: "18:00" },
    workDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    holidays: ["25/12", "01/01", "12/10"],
    simultaneousCapacity: 1,
    status: "available",
    todayEvents: 5,
  },
];

const statusLabels = {
  available: { label: "Disponível", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  busy: { label: "Ocupado", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  offline: { label: "Offline", color: "bg-muted text-muted-foreground" },
};

export default function Agendas() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendas (Pessoas)</h1>
            <p className="text-muted-foreground">Gerencie disponibilidades, horários e capacidades</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Pessoa
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Agendas</p>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponíveis Agora</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {users.filter(u => u.status === "available").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ocupados</p>
                  <p className="text-2xl font-bold text-amber-500">
                    {users.filter(u => u.status === "busy").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Eventos Hoje</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users.reduce((acc, u) => acc + u.todayEvents, 0)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const statusConfig = statusLabels[user.status as keyof typeof statusLabels];
            
            return (
              <Card key={user.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    {/* Work Hours */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {user.workHours.start} - {user.workHours.end}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-1">
                          {user.workDays.map((day) => (
                            <Badge key={day} variant="outline" className="text-xs px-1">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Capacidade</p>
                        <p className="font-medium text-foreground">{user.simultaneousCapacity} evento(s)</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Hoje</p>
                        <p className="font-medium text-foreground">{user.todayEvents} eventos</p>
                      </div>
                    </div>
                    
                    {/* Holidays */}
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Feriados configurados:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.holidays.map((holiday) => (
                          <Badge key={holiday} variant="secondary" className="text-xs">
                            {holiday}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Calendar className="h-3 w-3" />
                        Ver Agenda
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
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
