import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Video,
  CheckCircle,
  Settings,
  Link,
  ExternalLink,
  Clock,
  Calendar,
  Bot
} from "lucide-react";

const recentMeetings = [
  {
    id: 1,
    title: "Reunião Comercial - Empresa ABC",
    date: "Hoje, 14:00",
    duration: "1h",
    participants: 3,
    link: "https://meet.google.com/abc-defg-hij",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Demo de Produto",
    date: "Amanhã, 10:00",
    duration: "45min",
    participants: 2,
    link: "https://meet.google.com/xyz-uvwx-abc",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Kick-off Projeto Delta",
    date: "Ontem, 09:00",
    duration: "2h",
    participants: 5,
    link: "https://meet.google.com/def-ghij-klm",
    status: "completed",
  },
];

const autoCreateSettings = [
  { id: 1, type: "Reunião Comercial", enabled: true },
  { id: 2, type: "Demo de Produto", enabled: true },
  { id: 3, type: "Onboarding", enabled: true },
  { id: 4, type: "Follow-up", enabled: false },
  { id: 5, type: "Alinhamento Interno", enabled: true },
];

export default function GoogleMeet() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Google Meet</h1>
            <p className="text-muted-foreground">Configure criação automática de reuniões</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reuniões Criadas (30d)</p>
                  <p className="text-2xl font-bold text-foreground">89</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Links Ativos</p>
                  <p className="text-2xl font-bold text-emerald-500">12</p>
                </div>
                <Link className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Próximas Hoje</p>
                  <p className="text-2xl font-bold text-blue-500">3</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Criadas por IA</p>
                  <p className="text-2xl font-bold text-violet-500">34</p>
                </div>
                <Bot className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Auto-create Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Criação Automática
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure quais tipos de evento criam links automaticamente
              </p>
              <div className="space-y-4">
                {autoCreateSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <Label className="font-normal text-foreground">{setting.type}</Label>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Meetings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Video className="h-5 w-5" />
                Reuniões Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{meeting.title}</h4>
                      {meeting.status === "upcoming" ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Próxima
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Concluída
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {meeting.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meeting.duration}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {meeting.link.replace("https://", "")}
                      </code>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Abrir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <h4 className="font-medium text-foreground">Adicionar link ao convite</h4>
                <p className="text-sm text-muted-foreground">
                  Incluir link do Google Meet automaticamente nos emails de convite
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <h4 className="font-medium text-foreground">Gerar link antecipado</h4>
                <p className="text-sm text-muted-foreground">
                  Criar link no momento do agendamento (não apenas antes da reunião)
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <h4 className="font-medium text-foreground">Permitir IA criar reuniões</h4>
                <p className="text-sm text-muted-foreground">
                  IA pode gerar links de reunião automaticamente quando necessário
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Integração Ativa</h3>
                <p className="text-sm text-muted-foreground">
                  Google Meet está configurado e funcionando corretamente. Links são criados automaticamente para os tipos de evento habilitados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
