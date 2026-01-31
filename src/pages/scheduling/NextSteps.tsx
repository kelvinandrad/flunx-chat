import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Clock, 
  AlertTriangle,
  Bot,
  User,
  ArrowRight,
  Play,
  CheckCircle,
  MessageCircle,
  Hourglass
} from "lucide-react";

const stepGroups = [
  {
    title: "Atrasados",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/10",
    borderColor: "border-red-200 dark:border-red-800",
    items: [
      { 
        id: 1, 
        action: "Cobrar retorno sobre proposta", 
        person: "Empresa Alpha", 
        executor: "IA", 
        risk: "Perda de oportunidade de R$ 50k",
        overdue: "3 dias"
      },
      { 
        id: 2, 
        action: "Enviar documentação pendente", 
        person: "Cliente Beta", 
        executor: "João Silva", 
        risk: "Atraso na assinatura do contrato",
        overdue: "1 dia"
      },
    ]
  },
  {
    title: "Hoje",
    icon: Clock,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    items: [
      { 
        id: 3, 
        action: "Confirmar reunião de amanhã", 
        person: "Empresa Gama", 
        executor: "IA", 
        risk: "No-show na reunião"
      },
      { 
        id: 4, 
        action: "Enviar proposta comercial", 
        person: "Lead Delta", 
        executor: "Ana Costa", 
        risk: "Concorrente pode fechar antes"
      },
      { 
        id: 5, 
        action: "Revisar contrato", 
        person: "Cliente Epsilon", 
        executor: "Carlos Lima", 
        risk: "Prazo de assinatura vence amanhã"
      },
    ]
  },
  {
    title: "Em Risco",
    icon: Hourglass,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/10",
    borderColor: "border-orange-200 dark:border-orange-800",
    items: [
      { 
        id: 6, 
        action: "Negociar desconto solicitado", 
        person: "Empresa Zeta", 
        executor: "João Silva", 
        risk: "Pode desistir se não atender"
      },
    ]
  },
  {
    title: "Automatizado pela IA",
    icon: Bot,
    iconColor: "text-violet-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/10",
    borderColor: "border-violet-200 dark:border-violet-800",
    items: [
      { 
        id: 7, 
        action: "Enviar lembrete de reunião", 
        person: "Cliente Eta", 
        executor: "IA", 
        status: "Agendado para 2h antes"
      },
      { 
        id: 8, 
        action: "Follow-up pós-demo", 
        person: "Lead Theta", 
        executor: "IA", 
        status: "Execução automática às 14:00"
      },
    ]
  },
  {
    title: "Aguardando Resposta",
    icon: MessageCircle,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    items: [
      { 
        id: 9, 
        action: "Resposta sobre orçamento", 
        person: "Empresa Iota", 
        executor: "Aguardando cliente", 
        waitingSince: "2 dias"
      },
      { 
        id: 10, 
        action: "Confirmação de data", 
        person: "Cliente Kappa", 
        executor: "Aguardando cliente", 
        waitingSince: "1 dia"
      },
    ]
  },
];

export default function NextSteps() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Próximos Passos</h1>
            <p className="text-muted-foreground">Visão estratégica priorizada por impacto, não por horário</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bot className="h-4 w-4" />
              Delegar para IA
            </Button>
            <Button className="gap-2">
              <Target className="h-4 w-4" />
              Novo Passo
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">2</p>
                <p className="text-xs text-muted-foreground">Atrasados</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-amber-500">3</p>
                <p className="text-xs text-muted-foreground">Para Hoje</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <Hourglass className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-500">1</p>
                <p className="text-xs text-muted-foreground">Em Risco</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <Bot className="h-8 w-8 text-violet-500" />
              <div>
                <p className="text-2xl font-bold text-violet-500">2</p>
                <p className="text-xs text-muted-foreground">Automatizados</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-500">2</p>
                <p className="text-xs text-muted-foreground">Aguardando</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Groups */}
        <div className="space-y-6">
          {stepGroups.map((group) => (
            <Card key={group.title} className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  <group.icon className={`h-5 w-5 ${group.iconColor}`} />
                  {group.title}
                  <Badge variant="secondary" className="ml-2">{group.items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-lg ${group.bgColor} border ${group.borderColor}`}
                    >
                      <div className="flex-1 space-y-2">
                        {/* O que precisa ser feito */}
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-foreground" />
                          <span className="font-medium text-foreground">{item.action}</span>
                        </div>
                        
                        {/* Info row */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {/* Para quem */}
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {item.person}
                          </div>
                          
                          {/* Quem executa */}
                          <div className="flex items-center gap-1">
                            {item.executor === "IA" ? (
                              <Badge variant="outline" className="border-violet-300 text-violet-600 dark:border-violet-700 dark:text-violet-400">
                                <Bot className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            ) : item.executor.includes("Aguardando") ? (
                              <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {item.executor}
                              </Badge>
                            ) : (
                              <>
                                <User className="h-4 w-4" />
                                {item.executor}
                              </>
                            )}
                          </div>
                          
                          {/* Risco / Status */}
                          {item.risk && (
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4" />
                              {item.risk}
                            </div>
                          )}
                          {item.status && (
                            <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
                              <Clock className="h-4 w-4" />
                              {item.status}
                            </div>
                          )}
                          {item.overdue && (
                            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              {item.overdue} atrasado
                            </Badge>
                          )}
                          {item.waitingSince && (
                            <span className="text-blue-600 dark:text-blue-400">
                              Aguardando há {item.waitingSince}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        {!item.status && !item.waitingSince && (
                          <Button size="sm" className="gap-1">
                            <Play className="h-3 w-3" />
                            Executar
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Concluir
                        </Button>
                        {item.executor !== "IA" && !item.executor.includes("Aguardando") && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <Bot className="h-3 w-3" />
                            Delegar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
