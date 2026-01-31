import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  Target,
  ArrowRight
} from "lucide-react";

const deadlineGroups = [
  {
    title: "Atrasados",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/10",
    items: [
      { id: 1, title: "Entrega de Proposta Comercial", person: "Cliente Alpha", responsible: "João Silva", dueDate: "Há 2 dias", progress: 80, priority: "high" },
      { id: 2, title: "Revisão de Contrato", person: "Empresa Beta", responsible: "Maria Santos", dueDate: "Há 1 dia", progress: 50, priority: "high" },
    ]
  },
  {
    title: "Vencendo Hoje",
    icon: Clock,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/10",
    items: [
      { id: 3, title: "Enviar Documentação", person: "Cliente Gama", responsible: "Ana Costa", dueDate: "Até 18:00", progress: 90, priority: "medium" },
    ]
  },
  {
    title: "Próximos 7 Dias",
    icon: Calendar,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    items: [
      { id: 4, title: "Finalizar Apresentação", person: "Interno", responsible: "Carlos Lima", dueDate: "Em 3 dias", progress: 60, priority: "medium" },
      { id: 5, title: "Aprovação de Orçamento", person: "Cliente Delta", responsible: "Pedro Oliveira", dueDate: "Em 5 dias", progress: 30, priority: "low" },
      { id: 6, title: "Kick-off Meeting Prep", person: "Empresa Epsilon", responsible: "Ana Costa", dueDate: "Em 7 dias", progress: 10, priority: "low" },
    ]
  },
  {
    title: "Concluídos Recentemente",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
    items: [
      { id: 7, title: "Contrato Assinado", person: "Cliente Zeta", responsible: "João Silva", dueDate: "Concluído ontem", progress: 100, priority: "completed" },
    ]
  },
];

const priorityColors = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const priorityLabels = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
  completed: "Concluído",
};

export default function Deadlines() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prazos</h1>
            <p className="text-muted-foreground">Acompanhe entregas, deadlines e marcos importantes</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Prazo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Atrasados</p>
                  <p className="text-2xl font-bold text-red-500">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                  <p className="text-2xl font-bold text-amber-500">1</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Próximos 7 Dias</p>
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
                  <p className="text-sm text-muted-foreground">Concluídos (7d)</p>
                  <p className="text-2xl font-bold text-emerald-500">1</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deadline Groups */}
        <div className="space-y-6">
          {deadlineGroups.map((group) => (
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
                      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg ${group.bgColor} border border-border`}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className={priorityColors[item.priority as keyof typeof priorityColors]}>
                            {priorityLabels[item.priority as keyof typeof priorityLabels]}
                          </Badge>
                          <span className="font-medium text-foreground">{item.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {item.person}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {item.responsible}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {item.dueDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={item.progress} className="h-2 flex-1" />
                          <span className="text-sm font-medium text-foreground">{item.progress}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item.priority !== "completed" && (
                          <>
                            <Button size="sm" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Concluir
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <ArrowRight className="h-3 w-3" />
                              Atualizar
                            </Button>
                          </>
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
