import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, Radio, MessageCircle, Users } from "lucide-react";
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
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Users, label: "Contatos", href: "/contatos" },
  { icon: Radio, label: "Canais", href: "/canais" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (href: string) => {
    navigate(href);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || (href !== "/" && location.pathname.startsWith(href));
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 min-h-screen h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section - igual flunx-v2 */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-sidebar-border px-3 flex-shrink-0",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-base">N</span>
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-sidebar-foreground text-lg">Flunx Chat</span>
          )}
        </div>
      </div>

      {/* Navigation - preenche até o fim da página */}
      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin py-2 px-2">
        <div>
          {!isCollapsed && (
            <div className="px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                Chat
              </span>
            </div>
          )}
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              if (isCollapsed) {
                return (
                  <li key={item.href}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleNavigate(item.href)}
                          className={cn(
                            "w-full flex items-center justify-center h-10 rounded-md transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-popover">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigate(item.href)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
