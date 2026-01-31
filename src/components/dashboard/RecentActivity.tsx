import { cn } from "@/lib/utils";
import { User, Target, CheckCircle, MessageSquare, Calendar } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "contact",
    icon: User,
    title: "Novo lead adicionado",
    description: "Maria Fernanda - Tech Solutions",
    time: "Há 5 min",
    color: "text-blue-500",
  },
  {
    id: 2,
    type: "opportunity",
    icon: Target,
    title: "Oportunidade avançou de estágio",
    description: "Contrato Enterprise - R$ 45.000",
    time: "Há 15 min",
    color: "text-primary",
  },
  {
    id: 3,
    type: "deal",
    icon: CheckCircle,
    title: "Negócio fechado",
    description: "Plano Premium - R$ 12.800/mês",
    time: "Há 1 hora",
    color: "text-success",
  },
  {
    id: 4,
    type: "message",
    icon: MessageSquare,
    title: "Nova mensagem recebida",
    description: "João Pedro respondeu à proposta",
    time: "Há 2 horas",
    color: "text-purple-500",
  },
  {
    id: 5,
    type: "meeting",
    icon: Calendar,
    title: "Reunião agendada",
    description: "Call de apresentação - Amanhã 14h",
    time: "Há 3 horas",
    color: "text-orange-500",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 card-hover">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Atividades Recentes</h3>
        <p className="text-sm text-muted-foreground">Últimas atualizações do sistema</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0",
                  activity.color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
