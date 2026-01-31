import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Clock, 
  Bot, 
  Play, 
  Calendar, 
  Zap, 
  AlertTriangle,
  ArrowUp,
  User,
  ArrowRight
} from "lucide-react";

const followupGroups = [
  {
    title: "Atrasados",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    items: [
      { id: 1, context: "Proposta comercial não respondida", person: "Empresa Alpha", lastInteraction: "5 dias atrás", nextAction: "Cobrar retorno", executor: "IA", priority: "high" },
      { id: 2, context: "Contrato aguardando assinatura", person: "João Pereira", lastInteraction: "3 dias atrás", nextAction: "Confirmar interesse", executor: "Carlos Lima", priority: "high" },
    ]
  },
  {
    title: "Hoje",
    icon: Clock,
    iconColor: "text-amber-500",
    items: [
      { id: 3, context: "Demo realizada ontem", person: "Empresa Beta", lastInteraction: "1 dia atrás", nextAction: "Enviar proposta", executor: "IA", priority: "medium" },
      { id: 4, context: "Aguardando retorno sobre preço", person: "Maria Santos", lastInteraction: "2 dias atrás", nextAction: "Negociar condições", executor: "Ana Costa", priority: "medium" },
    ]
  },
  {
    title: "Amanhã",
    icon: Calendar,
    iconColor: "text-blue-500",
    items: [
      { id: 5, context: "Primeiro contato via formulário", person: "Lead Gama", lastInteraction: "Novo lead", nextAction: "Qualificar interesse", executor: "IA", priority: "low" },
    ]
  },
  {
    title: "Próximos Dias",
    icon: ArrowRight,
    iconColor: "text-muted-foreground",
    items: [
      { id: 6, context: "Reunião agendada para sexta", person: "Cliente Delta", lastInteraction: "Reunião marcada", nextAction: "Confirmar participação", executor: "IA", priority: "low" },
      { id: 7, context: "Trial expirando em 5 dias", person: "Empresa Epsilon", lastInteraction: "Sem interação recente", nextAction: "Oferecer upgrade", executor: "IA", priority: "medium" },
    ]
  },
];

const priorityColors = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function Followups() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Follow-ups</h1>
            <p className="text-muted-foreground">Lista orientada a ação para acompanhamentos pendentes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bot className="h-4 w-4" />
              Automatizar Todos
            </Button>
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Novo Follow-up
            </Button>
          </div>
        </div>

        {/* Follow-up Groups */}
        <div className="space-y-6">
          {followupGroups.map((group) => (
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
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className={priorityColors[item.priority as keyof typeof priorityColors]}>
                            {item.priority === "high" ? "Alta" : item.priority === "medium" ? "Média" : "Baixa"}
                          </Badge>
                          <span className="font-medium text-foreground">{item.context}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {item.person}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {item.lastInteraction}
                          </div>
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-4 w-4" />
                            {item.nextAction}
                          </div>
                          <div className="flex items-center gap-1">
                            {item.executor === "IA" ? (
                              <Badge variant="outline" className="border-violet-300 text-violet-600 dark:border-violet-700 dark:text-violet-400">
                                <Bot className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            ) : (
                              <>
                                <User className="h-4 w-4" />
                                {item.executor}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1">
                          <Play className="h-3 w-3" />
                          Executar
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          Adiar
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Zap className="h-3 w-3" />
                          Automatizar
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <ArrowUp className="h-3 w-3" />
                          Escalar
                        </Button>
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
