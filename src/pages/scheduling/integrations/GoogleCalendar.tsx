import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Link,
  Unlink,
  ExternalLink,
  Clock
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@empresa.com",
    avatar: "JS",
    connected: true,
    calendar: "Calendário Principal",
    lastSync: "Há 5 minutos",
    eventsSync: 156,
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    avatar: "MS",
    connected: true,
    calendar: "Trabalho",
    lastSync: "Há 10 minutos",
    eventsSync: 89,
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana.costa@empresa.com",
    avatar: "AC",
    connected: false,
    calendar: null,
    lastSync: null,
    eventsSync: 0,
  },
  {
    id: 4,
    name: "Carlos Lima",
    email: "carlos.lima@empresa.com",
    avatar: "CL",
    connected: true,
    calendar: "Calendário Comercial",
    lastSync: "Há 2 minutos",
    eventsSync: 234,
  },
  {
    id: 5,
    name: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    avatar: "PO",
    connected: false,
    calendar: null,
    lastSync: null,
    eventsSync: 0,
  },
];

export default function GoogleCalendar() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Google Calendar</h1>
            <p className="text-muted-foreground">Conecte e sincronize calendários dos usuários</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conectados</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {users.filter(u => u.connected).length}
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
                  <p className="text-sm text-muted-foreground">Desconectados</p>
                  <p className="text-2xl font-bold text-red-500">
                    {users.filter(u => !u.connected).length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Eventos Sincronizados</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users.reduce((acc, u) => acc + u.eventsSync, 0)}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Conexões por Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {user.connected ? (
                      <>
                        <div className="text-sm">
                          <p className="text-foreground">{user.calendar}</p>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Sincronizado {user.lastSync}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectado
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Sincronizar
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Settings className="h-3 w-3" />
                            Configurar
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                            <Unlink className="h-3 w-3" />
                            Desconectar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          <XCircle className="h-3 w-3 mr-1" />
                          Não conectado
                        </Badge>
                        <Button className="gap-1">
                          <Link className="h-3 w-3" />
                          Conectar Google Calendar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Como funciona a sincronização?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Eventos criados no sistema aparecem automaticamente no Google Calendar</li>
                  <li>• Eventos do Google Calendar são importados para o sistema</li>
                  <li>• Alterações em qualquer plataforma são sincronizadas em tempo real</li>
                  <li>• Você pode escolher qual calendário usar para cada usuário</li>
                </ul>
                <Button variant="link" className="gap-1 p-0 mt-2 h-auto">
                  Ver documentação completa
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
