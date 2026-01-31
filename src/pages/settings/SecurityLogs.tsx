import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Activity,
  Bot,
  FileText,
  Download,
  Search,
  ChevronRight,
  Monitor,
  Lock,
  Eye
} from "lucide-react";

const actionLogs = [
  { id: 1, user: "João Silva", action: "Editou oportunidade", target: "Oportunidade #1234", date: "29/01/2026 14:32", ip: "192.168.1.100" },
  { id: 2, user: "Maria Santos", action: "Criou documento", target: "Contrato - Cliente ABC", date: "29/01/2026 14:15", ip: "192.168.1.101" },
  { id: 3, user: "Pedro Costa", action: "Enviou mensagem", target: "Conversa com Lead #567", date: "29/01/2026 13:45", ip: "192.168.1.102" },
  { id: 4, user: "Ana Oliveira", action: "Deletou lead", target: "Lead #890", date: "29/01/2026 12:20", ip: "192.168.1.103" },
  { id: 5, user: "João Silva", action: "Alterou configurações", target: "Configurações de e-mail", date: "29/01/2026 11:00", ip: "192.168.1.100" },
];

const aiLogs = [
  { id: 1, agent: "Agente de Vendas", action: "Enviou mensagem automática", context: "Lead qualificado", date: "29/01/2026 14:30" },
  { id: 2, agent: "Orquestrador", action: "Distribuiu tarefa", context: "Novo lead recebido", date: "29/01/2026 14:28" },
  { id: 3, agent: "Agente de Suporte", action: "Respondeu dúvida", context: "FAQ sobre preços", date: "29/01/2026 14:15" },
  { id: 4, agent: "Agente de Vendas", action: "Agendou reunião", context: "Demonstração do produto", date: "29/01/2026 13:50" },
  { id: 5, agent: "Orquestrador", action: "Escalou para humano", context: "Solicitação complexa", date: "29/01/2026 13:30" },
];

const adminLogs = [
  { id: 1, user: "Admin", action: "Alterou permissões", details: "Usuário Pedro Costa - Papel: Vendedor", date: "29/01/2026 10:00" },
  { id: 2, user: "Admin", action: "Criou integração", details: "Conexão com Stripe estabelecida", date: "28/01/2026 16:30" },
  { id: 3, user: "Admin", action: "Atualizou template", details: "Template de contrato v2.1", date: "28/01/2026 14:00" },
  { id: 4, user: "Admin", action: "Removeu usuário", details: "Usuário inativo removido", date: "27/01/2026 11:00" },
];

const activeSessions = [
  { id: 1, user: "João Silva", device: "Chrome / Windows", location: "São Paulo, BR", started: "Há 2 horas", current: true },
  { id: 2, user: "Maria Santos", device: "Safari / macOS", location: "Rio de Janeiro, BR", started: "Há 5 horas", current: false },
  { id: 3, user: "Pedro Costa", device: "Chrome / Android", location: "Belo Horizonte, BR", started: "Há 1 dia", current: false },
];

export default function SecurityLogs() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Segurança & Logs</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Segurança & Logs</h1>
            <p className="text-muted-foreground mt-1">
              Auditoria, monitoramento e políticas de segurança.
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>

        <Tabs defaultValue="actions">
          <TabsList>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Ações
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              IA
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Sessões
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Políticas
            </TabsTrigger>
          </TabsList>

          {/* Action Logs */}
          <TabsContent value="actions" className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="7">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hoje</SelectItem>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Alvo</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actionLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.target}</TableCell>
                      <TableCell className="text-muted-foreground">{log.date}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{log.ip}</code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* AI Logs */}
          <TabsContent value="ai" className="mt-6 space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agente</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Contexto</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <span className="font-medium">{log.agent}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.context}</TableCell>
                      <TableCell className="text-muted-foreground">{log.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Admin Logs */}
          <TabsContent value="admin" className="mt-6 space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.details}</TableCell>
                      <TableCell className="text-muted-foreground">{log.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Active Sessions */}
          <TabsContent value="sessions" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sessões Ativas</CardTitle>
                <CardDescription>
                  Usuários atualmente conectados ao sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Monitor className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{session.user}</p>
                            {session.current && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                                Sessão atual
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session.device} • {session.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{session.started}</span>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Encerrar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Policies */}
          <TabsContent value="policies" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="h-5 w-5 text-primary" />
                    Autenticação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="space-y-0.5">
                      <Label>Autenticação em dois fatores (2FA)</Label>
                      <p className="text-sm text-muted-foreground">
                        Exigir 2FA para todos os usuários
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="space-y-0.5">
                      <Label>Expiração de senha</Label>
                      <p className="text-sm text-muted-foreground">
                        Forçar troca a cada 90 dias
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label>Bloqueio após tentativas</Label>
                      <p className="text-sm text-muted-foreground">
                        Bloquear após 5 tentativas falhas
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5 text-primary" />
                    Privacidade & Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="space-y-0.5">
                      <Label>Criptografia de dados sensíveis</Label>
                      <p className="text-sm text-muted-foreground">
                        Criptografar dados em repouso
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="space-y-0.5">
                      <Label>Retenção de logs</Label>
                      <p className="text-sm text-muted-foreground">
                        Manter logs por 1 ano
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label>Anonimização de dados</Label>
                      <p className="text-sm text-muted-foreground">
                        Anonimizar dados após exclusão
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
