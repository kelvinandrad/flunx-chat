import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  UserPlus,
  Shield,
  History,
  ChevronRight,
  Search,
  MoreHorizontal,
  Mail,
  Check,
  X
} from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@nexus.com.br",
    role: "Admin",
    status: "Ativo",
    lastAccess: "Há 2 horas",
    avatar: null
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@nexus.com.br",
    role: "Gestor",
    status: "Ativo",
    lastAccess: "Há 5 horas",
    avatar: null
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@nexus.com.br",
    role: "Vendedor",
    status: "Ativo",
    lastAccess: "Ontem",
    avatar: null
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@nexus.com.br",
    role: "Vendedor",
    status: "Pendente",
    lastAccess: "-",
    avatar: null
  },
];

const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Acesso total ao sistema",
    users: 2,
    color: "bg-red-500"
  },
  {
    id: 2,
    name: "Gestor",
    description: "Gerencia equipes e relatórios",
    users: 3,
    color: "bg-blue-500"
  },
  {
    id: 3,
    name: "Vendedor",
    description: "Acesso ao CRM e comunicação",
    users: 7,
    color: "bg-green-500"
  },
  {
    id: 4,
    name: "Visualizador",
    description: "Apenas visualização de dados",
    users: 1,
    color: "bg-gray-500"
  },
];

const mockAccessLogs = [
  { user: "João Silva", action: "Login", date: "29/01/2026 14:32", ip: "192.168.1.100" },
  { user: "Maria Santos", action: "Login", date: "29/01/2026 09:15", ip: "192.168.1.101" },
  { user: "Pedro Costa", action: "Logout", date: "28/01/2026 18:45", ip: "192.168.1.102" },
  { user: "João Silva", action: "Alterou configurações", date: "28/01/2026 16:20", ip: "192.168.1.100" },
];

const modules = [
  "Dashboard",
  "Pessoas",
  "Comercial",
  "Funis",
  "Comunicação",
  "Produtos",
  "Tráfego",
  "Traqueamento",
  "Agendamentos",
  "Formalização",
  "Configurações"
];

export default function UsersPermissions() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Usuários & Permissões</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Usuários & Permissões</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie usuários, grupos e permissões de acesso.
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar Usuário
          </Button>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Grupos / Papéis
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Permissões
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="text-xs">
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            user.status === "Ativo" 
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastAccess}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="mt-6 space-y-4">
            <div className="flex justify-end">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Novo Grupo
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mockRoles.map((role) => (
                <Card key={role.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${role.color}`} />
                        <CardTitle className="text-base">{role.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">{role.users} usuários</Badge>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Matriz de Permissões</CardTitle>
                <CardDescription>
                  Configure as permissões por módulo e ação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Módulo</TableHead>
                      <TableHead className="text-center">Visualizar</TableHead>
                      <TableHead className="text-center">Criar</TableHead>
                      <TableHead className="text-center">Editar</TableHead>
                      <TableHead className="text-center">Excluir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module}>
                        <TableCell className="font-medium">{module}</TableCell>
                        <TableCell className="text-center">
                          <Switch defaultChecked />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch defaultChecked={module !== "Configurações"} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch defaultChecked={module !== "Configurações"} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch defaultChecked={module !== "Configurações" && module !== "Dashboard"} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Acessos</CardTitle>
                <CardDescription>
                  Registro de atividades e logins do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAccessLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-muted-foreground">{log.date}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {log.ip}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
