import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Sparkles, 
  Save,
  ArrowRight,
  Bot,
  AlertTriangle,
  Clock,
  Users,
  Shuffle,
  Shield
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const agentOrder = [
  { id: 1, name: "Vendas AI", priority: 1, enabled: true },
  { id: 2, name: "Suporte AI", priority: 2, enabled: true },
  { id: 3, name: "Agendamento AI", priority: 3, enabled: true },
  { id: 4, name: "Cobrança AI", priority: 4, enabled: false },
];

export default function Orchestrator() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Orquestrador</h1>
              <p className="text-muted-foreground mt-1">
                Configure a inteligência central que coordena todos os agentes
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>

        {/* Alert Banner */}
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">O Orquestrador coordena agentes, não responde diretamente ao usuário.</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Ele analisa as mensagens recebidas, classifica a intenção e delega para o agente especializado mais adequado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classification Strategy */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shuffle className="h-5 w-5 text-muted-foreground" />
                Estratégia de Classificação
              </CardTitle>
              <CardDescription>Como o orquestrador identifica a intenção do usuário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modelo de Classificação</Label>
                <Select defaultValue="semantic">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="semantic">Análise Semântica (recomendado)</SelectItem>
                    <SelectItem value="keyword">Palavras-chave</SelectItem>
                    <SelectItem value="hybrid">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Confiança mínima para roteamento</Label>
                <div className="pt-2">
                  <Slider defaultValue={[70]} max={100} step={5} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>0%</span>
                    <span className="font-medium text-foreground">70%</span>
                    <span>100%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Abaixo deste valor, a mensagem vai para fallback
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Tempo de Resposta
              </CardTitle>
              <CardDescription>Limites de tempo para decisões do orquestrador</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tempo máximo para classificação</Label>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={3} className="w-24" />
                  <span className="text-sm text-muted-foreground">segundos</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tempo máximo para resposta do agente</Label>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={15} className="w-24" />
                  <span className="text-sm text-muted-foreground">segundos</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Timeout automático</p>
                  <p className="text-xs text-muted-foreground">Escalar para humano após timeout</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Order */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-muted-foreground" />
              Ordem de Chamada de Agentes
            </CardTitle>
            <CardDescription>Prioridade de roteamento quando há ambiguidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentOrder.map((agent, index) => (
                <div 
                  key={agent.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    agent.enabled ? 'border-border' : 'border-border/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Prioridade {agent.priority}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {index < agentOrder.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch defaultChecked={agent.enabled} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fallback Criteria */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Critérios de Fallback
              </CardTitle>
              <CardDescription>Quando acionar fallback para humano</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Confiança abaixo do mínimo", enabled: true },
                  { label: "Nenhum agente disponível", enabled: true },
                  { label: "Usuário solicita humano", enabled: true },
                  { label: "Erro consecutivo de agentes", enabled: true },
                  { label: "Sentimento muito negativo", enabled: false },
                ].map((criteria) => (
                  <div key={criteria.label} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm text-foreground">{criteria.label}</span>
                    <Switch defaultChecked={criteria.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Escalation Policy */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Política de Escalonamento
              </CardTitle>
              <CardDescription>Como escalar conversas para atendimento humano</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modo de Escalonamento</Label>
                <Select defaultValue="round-robin">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="least-busy">Menos Ocupado</SelectItem>
                    <SelectItem value="skill-based">Por Especialidade</SelectItem>
                    <SelectItem value="manual">Fila Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mensagem de transição</Label>
                <Textarea 
                  placeholder="Vou transferir você para um de nossos especialistas. Um momento..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Notificar atendente</p>
                  <p className="text-xs text-muted-foreground">Enviar alerta sonoro/visual</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
