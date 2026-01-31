import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Zap,
  FileSignature,
  CreditCard,
  CheckCircle,
  Clock,
  Bot,
  ArrowRight
} from "lucide-react";

const rules = [
  {
    id: "1",
    name: "Lembrete de Assinatura",
    trigger: "Documento não assinado em 3 dias",
    action: "IA envia lembrete ao cliente",
    enabled: true,
    executions: 45,
    icon: FileSignature,
  },
  {
    id: "2",
    name: "Cobrança Atrasada",
    trigger: "Pagamento em atraso por 1 dia",
    action: "IA envia mensagem de cobrança",
    enabled: true,
    executions: 23,
    icon: CreditCard,
  },
  {
    id: "3",
    name: "Processo Concluído",
    trigger: "Todos documentos assinados + todos pagamentos recebidos",
    action: "Marcar processo como Concluído",
    enabled: true,
    executions: 89,
    icon: CheckCircle,
  },
  {
    id: "4",
    name: "Insistência de Cobrança",
    trigger: "Sem resposta após 3 dias da cobrança",
    action: "IA insiste até 3 vezes",
    enabled: false,
    executions: 12,
    icon: Clock,
  },
  {
    id: "5",
    name: "Alerta de Risco",
    trigger: "Pagamento atrasado por 7+ dias",
    action: "Marcar processo como Em Risco",
    enabled: true,
    executions: 8,
    icon: Bot,
  },
];

export default function AdminRules() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Regras Administrativas</h1>
            <p className="text-muted-foreground">
              Configure automações para processos de formalização
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <rule.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant={rule.enabled ? "default" : "secondary"}>
                          {rule.enabled ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>{rule.trigger}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                          <Bot className="h-4 w-4 text-primary" />
                          <span>{rule.action}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {rule.executions} execuções neste mês
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">Editar</Button>
                    <Switch checked={rule.enabled} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Como funcionam as regras?</h4>
                <p className="text-sm text-muted-foreground">
                  As regras administrativas são executadas automaticamente quando as condições de gatilho são atendidas.
                  A IA pode enviar mensagens, atualizar status de processos e criar alertas com base nas configurações definidas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
