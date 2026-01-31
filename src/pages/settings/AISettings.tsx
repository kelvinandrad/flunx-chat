import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Bot,
  Sparkles,
  Shield,
  Settings,
  ChevronRight,
  MessageSquare,
  Calendar,
  FileSignature,
  Target,
  Network
} from "lucide-react";

const agents = [
  {
    id: 1,
    name: "Orquestrador Central",
    role: "Coordena todos os agentes e distribui tarefas",
    status: "Ativo",
    type: "orchestrator",
    modules: ["Todos"]
  },
  {
    id: 2,
    name: "Agente de Vendas",
    role: "Qualifica leads e conduz negociações",
    status: "Ativo",
    type: "specialist",
    modules: ["Comunicação", "CRM"]
  },
  {
    id: 3,
    name: "Agente de Suporte",
    role: "Atende dúvidas e resolve problemas",
    status: "Ativo",
    type: "specialist",
    modules: ["Comunicação"]
  },
  {
    id: 4,
    name: "Agente de Agendamento",
    role: "Gerencia calendários e confirma reuniões",
    status: "Inativo",
    type: "specialist",
    modules: ["Agendamentos"]
  },
];

const permissions = [
  { module: "Comunicação", actions: ["Enviar mensagens", "Responder conversas", "Escalar para humano"] },
  { module: "CRM", actions: ["Criar oportunidades", "Mover etapas", "Registrar atividades"] },
  { module: "Agendamentos", actions: ["Criar eventos", "Reagendar", "Cancelar", "Enviar lembretes"] },
  { module: "Formalização", actions: ["Enviar documentos", "Cobrar pagamentos", "Follow-ups"] },
];

export default function AISettings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Inteligência Artificial</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Inteligência Artificial</h1>
            <p className="text-muted-foreground mt-1">
              Configure agentes, permissões e comportamento da IA.
            </p>
          </div>
          <Button>
            <Bot className="h-4 w-4 mr-2" />
            Novo Agente
          </Button>
        </div>

        <Tabs defaultValue="agents">
          <TabsList>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agentes
            </TabsTrigger>
            <TabsTrigger value="orchestrator" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Orquestrador
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permissões
            </TabsTrigger>
            <TabsTrigger value="identity" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Identidade
            </TabsTrigger>
            <TabsTrigger value="limits" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Limites
            </TabsTrigger>
          </TabsList>

          {/* Agents Tab */}
          <TabsContent value="agents" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className={`cursor-pointer hover:border-primary/50 transition-colors ${
                    agent.type === "orchestrator" ? "border-primary/30 bg-primary/5" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          agent.type === "orchestrator" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          {agent.type === "orchestrator" ? (
                            <Network className="h-5 w-5" />
                          ) : (
                            <Bot className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {agent.name}
                            {agent.type === "orchestrator" && (
                              <Badge variant="default" className="text-xs">Principal</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {agent.role}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          agent.status === "Ativo" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                        }
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {agent.modules.map((module) => (
                        <Badge key={module} variant="secondary" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orchestrator Tab */}
          <TabsContent value="orchestrator" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Network className="h-5 w-5 text-primary" />
                  Agente Orquestrador
                </CardTitle>
                <CardDescription>
                  O orquestrador central coordena todos os outros agentes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-semibold">3</p>
                    <p className="text-sm text-muted-foreground">Agentes Ativos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-semibold">1,234</p>
                    <p className="text-sm text-muted-foreground">Tarefas Hoje</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-semibold">98%</p>
                    <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  </div>
                </div>

                {/* Visual Orchestration */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-medium mb-4">Fluxo de Orquestração</h4>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                        <Network className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-medium">Orquestrador</span>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed relative max-w-32">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background px-2">
                        distribui
                      </span>
                    </div>
                    <div className="flex gap-4">
                      {["Vendas", "Suporte", "Agenda"].map((name, i) => (
                        <div key={name} className="flex flex-col items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                          </div>
                          <span className="text-xs">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="mt-6 space-y-4">
            {permissions.map((perm) => (
              <Card key={perm.module}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {perm.module === "Comunicação" && <MessageSquare className="h-4 w-4" />}
                    {perm.module === "CRM" && <Target className="h-4 w-4" />}
                    {perm.module === "Agendamentos" && <Calendar className="h-4 w-4" />}
                    {perm.module === "Formalização" && <FileSignature className="h-4 w-4" />}
                    {perm.module}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {perm.actions.map((action) => (
                      <div key={action} className="flex items-center justify-between">
                        <Label className="text-sm font-normal">{action}</Label>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Identity Tab */}
          <TabsContent value="identity" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identidade e Personalidade</CardTitle>
                <CardDescription>
                  Defina como a IA se apresenta e se comporta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da IA</Label>
                  <input 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="Assistente Nexus"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Papel / Função</Label>
                  <Textarea 
                    defaultValue="Sou o assistente virtual da Nexus. Ajudo a gerenciar suas vendas, comunicações e processos de forma inteligente e eficiente."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Missão Principal</Label>
                  <Textarea 
                    defaultValue="Minha missão é aumentar a eficiência do time, automatizando tarefas repetitivas e garantindo que nenhuma oportunidade seja perdida."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tom de Comunicação</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Profissional</Badge>
                    <Badge variant="secondary">Amigável</Badge>
                    <Badge variant="secondary">Formal</Badge>
                    <Badge variant="secondary">Casual</Badge>
                    <Badge variant="secondary">Técnico</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Limits Tab */}
          <TabsContent value="limits" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Limites de Ação</CardTitle>
                <CardDescription>
                  Configure o que a IA pode ou não fazer autonomamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Criar eventos no calendário</Label>
                    <p className="text-sm text-muted-foreground">IA pode agendar reuniões e follow-ups</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Enviar mensagens automaticamente</Label>
                    <p className="text-sm text-muted-foreground">IA pode enviar mensagens sem aprovação</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Alterar valores de propostas</Label>
                    <p className="text-sm text-muted-foreground">IA pode modificar preços e condições</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Gerar cobranças</Label>
                    <p className="text-sm text-muted-foreground">IA pode criar links de pagamento</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Mover leads entre etapas</Label>
                    <p className="text-sm text-muted-foreground">IA pode atualizar status do funil</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Cancelar eventos</Label>
                    <p className="text-sm text-muted-foreground">IA pode cancelar reuniões agendadas</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
