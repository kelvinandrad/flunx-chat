import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Bot, 
  Save,
  User,
  Target,
  Shield,
  BookOpen,
  Network,
  MessageSquare,
  Calendar,
  CreditCard,
  Users,
  GitBranch,
  Package,
  FileSignature,
  Link
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const modulePermissions = [
  { id: "pessoas", label: "Pessoas", icon: Users, description: "Consultar e gerenciar pessoas" },
  { id: "crm", label: "CRM", icon: Target, description: "Acessar oportunidades e pipeline" },
  { id: "funis", label: "Funis", icon: GitBranch, description: "Visualizar e mover etapas" },
  { id: "produtos", label: "Produtos", icon: Package, description: "Consultar catálogo e preços" },
  { id: "agenda", label: "Agenda", icon: Calendar, description: "Acessar horários disponíveis" },
  { id: "contratos", label: "Contratos", icon: FileSignature, description: "Visualizar e gerar contratos" },
];

const actionPermissions = [
  { id: "criar_pessoa", label: "Criar / atualizar pessoa", category: "Pessoas" },
  { id: "mover_etapa", label: "Mover etapa de funil", category: "Funis" },
  { id: "agendar_reuniao", label: "Agendar reunião", category: "Agenda" },
  { id: "enviar_link_pagamento", label: "Enviar link de pagamento", category: "Pagamentos" },
  { id: "enviar_contrato", label: "Enviar contrato", category: "Contratos" },
  { id: "criar_oportunidade", label: "Criar oportunidade", category: "CRM" },
];

const knowledgeBases = [
  { id: 1, name: "FAQ Geral", type: "FAQ", documents: 45, priority: 1 },
  { id: 2, name: "Documentação de Produtos", type: "Documentos", documents: 128, priority: 2 },
  { id: 3, name: "Catálogo de Preços", type: "Produtos", documents: 67, priority: 3 },
];

export default function AgentEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'novo';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/comunicacao/ia/agentes')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {isNew ? 'Criar Agente' : 'Editar Agente'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure a identidade, permissões e comportamento do agente
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">Cancelar</Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Agente
            </Button>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="identity" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="identity" className="gap-2">
              <User className="h-4 w-4" />
              Identidade
            </TabsTrigger>
            <TabsTrigger value="mission" className="gap-2">
              <Target className="h-4 w-4" />
              Missão & Objetivo
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissões
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Base de Conhecimento
            </TabsTrigger>
            <TabsTrigger value="orchestration" className="gap-2">
              <Network className="h-4 w-4" />
              Orquestração
            </TabsTrigger>
          </TabsList>

          {/* Identity Tab */}
          <TabsContent value="identity" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Identidade do Agente</CardTitle>
                <CardDescription>Defina como o agente se apresenta e se comunica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nome do Agente</Label>
                    <Input placeholder="Ex: Vendas AI, Suporte Premium..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Papel Principal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                        <SelectItem value="agendamento">Agendamento</SelectItem>
                        <SelectItem value="cobranca">Cobrança</SelectItem>
                        <SelectItem value="qualificacao">Qualificação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tom de Voz</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="amigavel">Amigável</SelectItem>
                        <SelectItem value="profissional">Profissional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select defaultValue="pt-br">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Persona (descrição detalhada)</Label>
                  <Textarea 
                    placeholder="Descreva a personalidade, forma de se comunicar, expressões típicas e comportamento do agente..."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta descrição será usada para moldar o comportamento do agente nas conversas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mission Tab */}
          <TabsContent value="mission" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Missão & Objetivo</CardTitle>
                <CardDescription>Defina o propósito e critérios de sucesso do agente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Objetivo Principal</Label>
                  <Textarea 
                    placeholder="Ex: Qualificar leads e identificar oportunidades de venda..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Critério de Sucesso</Label>
                  <Textarea 
                    placeholder="Ex: Conversa é considerada sucesso quando o lead agenda uma demonstração..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Quando encerrar a conversa</Label>
                    <Textarea 
                      placeholder="Ex: Após confirmar agendamento, após 3 mensagens sem resposta..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quando escalar para humano</Label>
                    <Textarea 
                      placeholder="Ex: Quando o cliente pedir falar com humano, quando não souber responder..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Acesso a Módulos</CardTitle>
                <CardDescription>Defina quais módulos do sistema o agente pode acessar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modulePermissions.map((module) => {
                    const Icon = module.icon;
                    return (
                      <div 
                        key={module.id}
                        className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <Checkbox id={module.id} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor={module.id} className="font-medium cursor-pointer">
                              {module.label}
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Ações Permitidas</CardTitle>
                <CardDescription>Defina quais ações o agente pode executar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionPermissions.map((action) => (
                    <div 
                      key={action.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox id={action.id} />
                        <div>
                          <Label htmlFor={action.id} className="font-medium cursor-pointer">
                            {action.label}
                          </Label>
                          <Badge variant="outline" className="ml-2 text-xs">{action.category}</Badge>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Bases de Conhecimento</CardTitle>
                    <CardDescription>Conecte bases de conhecimento para o agente consultar</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Link className="h-4 w-4" />
                    Conectar Base
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {knowledgeBases.map((base, index) => (
                    <div 
                      key={base.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{base.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs">{base.type}</Badge>
                            <span className="text-xs text-muted-foreground">{base.documents} documentos</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Prioridade</p>
                          <Select defaultValue={String(base.priority)}>
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="1">Alta</SelectItem>
                              <SelectItem value="2">Média</SelectItem>
                              <SelectItem value="3">Baixa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
                  <Label>Limite de uso por resposta</Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    Quantidade máxima de fragmentos que o agente pode usar em cada resposta
                  </p>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="3">3 fragmentos</SelectItem>
                      <SelectItem value="5">5 fragmentos</SelectItem>
                      <SelectItem value="10">10 fragmentos</SelectItem>
                      <SelectItem value="unlimited">Sem limite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orchestration Tab */}
          <TabsContent value="orchestration" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Configuração de Orquestração</CardTitle>
                <CardDescription>Defina como este agente interage com outros agentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Quem pode chamar este agente</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Selecione quais agentes podem delegar tarefas para este
                    </p>
                    <div className="space-y-2">
                      {['Orquestrador Principal', 'Vendas AI', 'Suporte AI'].map((agent) => (
                        <div key={agent} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                          <Checkbox id={agent} />
                          <Label htmlFor={agent} className="cursor-pointer">{agent}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Em que contexto é acionado</Label>
                    <Textarea 
                      placeholder="Ex: Quando o orquestrador identifica intenção de compra, quando há pergunta sobre preços..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>O que devolve ao fim da execução</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Tipo de resposta que este agente retorna
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                        <Checkbox className="mr-2 h-3 w-3" /> Texto (resposta ao usuário)
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                        <Checkbox className="mr-2 h-3 w-3" /> Decisão (para orquestrador)
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                        <Checkbox className="mr-2 h-3 w-3" /> Ação (executa no sistema)
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
