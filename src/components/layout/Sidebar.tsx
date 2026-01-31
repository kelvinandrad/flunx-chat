import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Visão Geral", href: "/" },
  { icon: MessageSquare, label: "Inboxes", href: "/inboxes" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const [expanded, setExpanded] = useState<string | null>("chat");
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-[52px]" : "w-56"
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-3">
        {!isCollapsed && (
          <span className="font-semibold text-foreground">Flunx Chat</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {!isCollapsed && (
          <div className="mb-2 px-2 py-1">
            <button
              onClick={() => setExpanded(expanded === "chat" ? null : "chat")}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span>Chat</span>
              {expanded === "chat" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {(isCollapsed || expanded === "chat") && (
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));

              const link = (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );

              return isCollapsed ? (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                link
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
