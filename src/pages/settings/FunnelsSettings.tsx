import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Zap,
  Bot,
  Eye,
  ArrowRight,
  ChevronRight,
  Plus
} from "lucide-react";

const funnelTypes = [
  { name: "Vendas", description: "Funil comercial padrão", stages: 5 },
  { name: "Onboarding", description: "Integração de novos clientes", stages: 4 },
  { name: "Suporte", description: "Atendimento e resolução", stages: 3 },
  { name: "Renovação", description: "Retenção e upsell", stages: 4 },
];

const automationEvents = [
  { event: "Lead criado", action: "Mover para primeira etapa", enabled: true },
  { event: "Reunião agendada", action: "Mover para etapa de negociação", enabled: true },
  { event: "Proposta enviada", action: "Mover para proposta", enabled: true },
  { event: "Contrato assinado", action: "Mover para fechamento", enabled: true },
  { event: "Pagamento confirmado", action: "Marcar como ganho", enabled: true },
  { event: "Sem resposta (7 dias)", action: "Mover para perdido", enabled: false },
];

export default function FunnelsSettings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Funis & Jornadas</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configurações de Funis & Jornadas</h1>
          <p className="text-muted-foreground mt-1">
            Regras globais para funis, movimentação de leads e automações.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Funnel Types */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GitBranch className="h-5 w-5 text-primary" />
                  Tipos de Funil
                </CardTitle>
                <CardDescription>
                  Modelos de funil disponíveis no sistema.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {funnelTypes.map((type) => (
                <div 
                  key={type.name}
                  className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  <Badge variant="secondary">{type.stages} etapas</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-primary" />
                Padrões de Visualização
              </CardTitle>
              <CardDescription>
                Como os funis são exibidos por padrão.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visualização Padrão</Label>
                <Select defaultValue="kanban">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kanban">Kanban (Colunas)</SelectItem>
                    <SelectItem value="list">Lista</SelectItem>
                    <SelectItem value="table">Tabela</SelectItem>
                    <SelectItem value="funnel">Funil Visual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ordenação Padrão</Label>
                <Select defaultValue="recent">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes primeiro</SelectItem>
                    <SelectItem value="oldest">Mais antigos primeiro</SelectItem>
                    <SelectItem value="value">Maior valor</SelectItem>
                    <SelectItem value="probability">Maior probabilidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2 border-t pt-4">
                <div className="space-y-0.5">
                  <Label>Mostrar valor total por etapa</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir soma de valores em cada coluna
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Mostrar tempo em cada etapa</Label>
                  <p className="text-sm text-muted-foreground">
                    Indicar há quanto tempo o lead está na etapa
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Entry/Exit Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowRight className="h-5 w-5 text-primary" />
                Regras de Entrada e Saída
              </CardTitle>
              <CardDescription>
                Como leads entram e saem dos funis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>Permitir múltiplos funis</Label>
                  <p className="text-sm text-muted-foreground">
                    Lead pode estar em mais de um funil
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>Bloquear retrocesso de etapa</Label>
                  <p className="text-sm text-muted-foreground">
                    Leads só podem avançar, nunca voltar
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>Exigir motivo ao perder</Label>
                  <p className="text-sm text-muted-foreground">
                    Obrigar registro de motivo de perda
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Arquivar leads inativos</Label>
                  <p className="text-sm text-muted-foreground">
                    Mover para arquivo após 30 dias sem ação
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* AI & Automation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-primary" />
                IA & Automações
              </CardTitle>
              <CardDescription>
                Integrações automáticas com IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode mover leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir movimentação automática
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode criar leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Criar oportunidades automaticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode qualificar leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Atribuir score e prioridade
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>IA pode encerrar leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Marcar como ganho ou perdido
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automation Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              Eventos de Automação
            </CardTitle>
            <CardDescription>
              Eventos que movem leads automaticamente entre etapas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {automationEvents.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-sm">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                    </div>
                  </div>
                  <Switch checked={item.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>Salvar Alterações</Button>
        </div>
      </div>
    </AppLayout>
  );
}
