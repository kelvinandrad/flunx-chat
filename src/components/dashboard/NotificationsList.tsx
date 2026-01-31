import { Bell, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "success",
    icon: CheckCircle2,
    title: "Meta mensal atingida!",
    message: "Sua equipe alcançou 102% da meta de janeiro.",
    time: "Hoje, 09:30",
  },
  {
    id: 2,
    type: "warning",
    icon: AlertCircle,
    title: "3 oportunidades sem follow-up",
    message: "Algumas oportunidades precisam de atenção.",
    time: "Hoje, 08:15",
  },
  {
    id: 3,
    type: "info",
    icon: Info,
    title: "Nova integração disponível",
    message: "Conecte seu WhatsApp Business.",
    time: "Ontem, 18:00",
  },
];

const systemStatus = [
  { label: "API", status: "online" },
  { label: "Database", status: "online" },
  { label: "AI Engine", status: "online" },
  { label: "Webhooks", status: "degraded" },
];

export function NotificationsList() {
  return (
    <div className="space-y-4">
      {/* Notifications */}
      <div className="bg-card rounded-xl border border-border p-5 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold text-foreground">Notificações</h3>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 mt-0.5 flex-shrink-0",
                      notification.type === "success" && "text-success",
                      notification.type === "warning" && "text-warning",
                      notification.type === "info" && "text-primary"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-card rounded-xl border border-border p-5 card-hover">
        <h3 className="text-base font-semibold text-foreground mb-4">Status do Sistema</h3>
        <div className="space-y-3">
          {systemStatus.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    item.status === "online" && "bg-success",
                    item.status === "degraded" && "bg-warning",
                    item.status === "offline" && "bg-destructive"
                  )}
                />
                <span
                  className={cn(
                    "text-xs capitalize",
                    item.status === "online" && "text-success",
                    item.status === "degraded" && "text-warning",
                    item.status === "offline" && "text-destructive"
                  )}
                >
                  {item.status === "online" ? "Operacional" : item.status === "degraded" ? "Degradado" : "Offline"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
