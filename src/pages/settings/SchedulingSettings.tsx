import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock,
  Zap,
  Bot,
  AlertTriangle,
  ChevronRight,
  Plus
} from "lucide-react";

const eventTypes = [
  { name: "Reunião Comercial", duration: 30, hasTime: true, aiCanAct: true, createsMeet: true },
  { name: "Follow-up", duration: 15, hasTime: false, aiCanAct: true, createsMeet: false },
  { name: "Prazo Interno", duration: 0, hasTime: false, aiCanAct: false, createsMeet: false },
  { name: "Confirmação", duration: 10, hasTime: true, aiCanAct: true, createsMeet: false },
];

export default function SchedulingSettings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Agendamentos</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configurações de Agendamentos</h1>
          <p className="text-muted-foreground mt-1">
            Regras globais de agenda, eventos e automações.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Default Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Configurações Padrão
              </CardTitle>
              <CardDescription>
                Valores padrão para novos eventos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Duração Padrão de Eventos</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1h 30min</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Intervalo entre Eventos</Label>
                <Select defaultValue="15">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem intervalo</SelectItem>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Antecedência Mínima para Agendamento</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem antecedência</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="1440">1 dia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Janela Máxima de Agendamento</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Conflict Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Regras de Conflito
              </CardTitle>
              <CardDescription>
                Como o sistema trata conflitos de agenda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>Bloquear agendamentos conflitantes</Label>
                  <p className="text-sm text-muted-foreground">
                    Impedir eventos no mesmo horário
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>Alertar sobre conflitos</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando houver sobreposição
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>Considerar tempo de deslocamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicionar buffer para eventos presenciais
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Sincronizar com calendário pessoal</Label>
                  <p className="text-sm text-muted-foreground">
                    Considerar eventos do Google Calendar
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* AI Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-primary" />
                Permissões da IA
              </CardTitle>
              <CardDescription>
                O que a IA pode fazer com agendamentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode criar eventos</Label>
                  <p className="text-sm text-muted-foreground">
                    Agendar reuniões e follow-ups automaticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode reagendar eventos</Label>
                  <p className="text-sm text-muted-foreground">
                    Mover eventos para novos horários
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode cancelar eventos</Label>
                  <p className="text-sm text-muted-foreground">
                    Cancelar reuniões não confirmadas
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>IA pode enviar lembretes</Label>
                  <p className="text-sm text-muted-foreground">
                    Lembrar participantes sobre eventos
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Follow-ups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Follow-ups Automáticos
              </CardTitle>
              <CardDescription>
                Regras de criação automática de follow-ups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>Criar follow-up após reunião</Label>
                  <p className="text-sm text-muted-foreground">
                    Agendar automaticamente próximo passo
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2 pt-2">
                <Label>Prazo padrão para follow-up</Label>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia útil</SelectItem>
                    <SelectItem value="2">2 dias úteis</SelectItem>
                    <SelectItem value="3">3 dias úteis</SelectItem>
                    <SelectItem value="5">5 dias úteis</SelectItem>
                    <SelectItem value="7">1 semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Escalar follow-ups atrasados</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar gestor sobre atrasos
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Types */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Tipos de Evento
              </CardTitle>
              <CardDescription>
                Configure os tipos de evento disponíveis no sistema.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {eventTypes.map((type) => (
                <div 
                  key={type.name}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{type.name}</h4>
                    <Badge variant="secondary">
                      {type.duration > 0 ? `${type.duration}min` : "Sem duração"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={type.hasTime ? "default" : "outline"} className="text-xs">
                      {type.hasTime ? "Com horário" : "Sem horário"}
                    </Badge>
                    <Badge variant={type.aiCanAct ? "default" : "outline"} className="text-xs">
                      {type.aiCanAct ? "IA pode agir" : "Somente humano"}
                    </Badge>
                    <Badge variant={type.createsMeet ? "default" : "outline"} className="text-xs">
                      {type.createsMeet ? "Cria Meet" : "Sem Meet"}
                    </Badge>
                  </div>
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
