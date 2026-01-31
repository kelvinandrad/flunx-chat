import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Workflow, 
  Bot,
  ArrowRight,
  Edit,
  Trash2,
  Clock,
  MessageCircle,
  Video,
  RefreshCw
} from "lucide-react";

const rules = [
  {
    id: 1,
    name: "Confirmação de Reunião",
    trigger: "Reunião não confirmada",
    action: "IA envia confirmação",
    timing: "24h antes",
    retries: 2,
    active: true,
    executions: 156,
    successRate: 87,
  },
  {
    id: 2,
    name: "Follow-up Pós-Demo",
    trigger: "Demo realizada",
    action: "IA envia follow-up",
    timing: "1 dia depois",
    retries: 3,
    active: true,
    executions: 89,
    successRate: 72,
  },
  {
    id: 3,
    name: "Cobrança de Retorno",
    trigger: "Sem resposta há 3 dias",
    action: "IA insiste com novo approach",
    timing: "Imediato",
    retries: 2,
    active: true,
    executions: 234,
    successRate: 45,
  },
  {
    id: 4,
    name: "Reengajamento de Lead Frio",
    trigger: "Sem interação há 7 dias",
    action: "IA envia conteúdo relevante",
    timing: "Manhã do 8º dia",
    retries: 1,
    active: false,
    executions: 67,
    successRate: 23,
  },
  {
    id: 5,
    name: "Lembrete de Prazo",
    trigger: "Prazo em 48h",
    action: "Notifica responsável",
    timing: "48h antes",
    retries: 0,
    active: true,
    executions: 112,
    successRate: 95,
  },
];

export default function FollowupRules() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Regras de Follow-up</h1>
            <p className="text-muted-foreground">Configure automações para follow-ups e acompanhamentos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Regra
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Regras Ativas</p>
                  <p className="text-2xl font-bold text-foreground">4</p>
                </div>
                <Workflow className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Execuções (30d)</p>
                  <p className="text-2xl font-bold text-foreground">658</p>
                </div>
                <Bot className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-emerald-500">64%</p>
                </div>
                <RefreshCw className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Economizado</p>
                  <p className="text-2xl font-bold text-foreground">42h</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className={`bg-card border-border ${!rule.active ? "opacity-60" : ""}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                      <Workflow className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{rule.name}</h3>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      
                      {/* Rule Flow */}
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-muted">
                          <Clock className="h-3 w-3 mr-1" />
                          {rule.trigger}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400">
                          <Bot className="h-3 w-3 mr-1" />
                          {rule.action}
                        </Badge>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {rule.timing}
                        </Badge>
                        {rule.retries > 0 && (
                          <Badge variant="secondary">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            {rule.retries}x retries
                          </Badge>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{rule.executions} execuções</span>
                        <span className={rule.successRate >= 70 ? "text-emerald-600" : rule.successRate >= 40 ? "text-amber-600" : "text-red-600"}>
                          {rule.successRate}% sucesso
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Switch checked={rule.active} />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual Examples */}
        <Card className="bg-muted/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Exemplos de Regras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-foreground">Reunião não confirmada</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <span>IA envia confirmação automática 24h antes</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-foreground">Sem resposta há 3 dias</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <span>IA insiste até 2x com abordagem diferente</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
