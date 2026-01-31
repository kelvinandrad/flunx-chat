import { Search, Bell, Moon, Sun, Contrast, Menu, LogOut, Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "./AppLayout";

interface TopbarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onToggleSidebar: () => void;
}

const THEME_CYCLE: ThemeMode[] = ["light", "mixed", "dark"];

function nextTheme(current: ThemeMode): ThemeMode {
  const i = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(i + 1) % THEME_CYCLE.length];
}

export function Topbar({ theme, onThemeChange, onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { organization, memberships, setOrganization } = useTenant();
  const isMixed = theme === "mixed";
  const topbarText = isMixed
    ? "text-sidebar-foreground"
    : "text-foreground";
  const topbarMuted = isMixed
    ? "text-sidebar-foreground/70 hover:text-sidebar-foreground"
    : "text-muted-foreground hover:text-foreground";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "Usuário";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 bg-topbar border-b border-topbar-border flex items-center justify-between px-4 lg:px-6",
        topbarText
      )}
    >
      {/* Left section - Menu toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className={topbarMuted}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Organization Selector */}
        {organization && memberships.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("flex items-center gap-2 text-sm font-medium", isMixed ? "text-sidebar-foreground hover:bg-sidebar-accent/50" : "")}>
                <Building2 className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">{organization.name}</span>
                {memberships.length > 1 && (
                  <ChevronDown className={cn("h-3 w-3", isMixed ? "text-sidebar-foreground/70" : "text-muted-foreground")} />
                )}
              </Button>
            </DropdownMenuTrigger>
            {memberships.length > 1 && (
              <DropdownMenuContent align="start" className="w-64 bg-card">
                <DropdownMenuLabel>Trocar organização</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {memberships.map((membership) => (
                  <DropdownMenuItem
                    key={membership.organization_id}
                    onClick={() => setOrganization(membership.organizations)}
                    className={
                      membership.organization_id === organization.id
                        ? "bg-primary/10"
                        : ""
                    }
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    {membership.organizations.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        )}
      </div>

      {/* Right section - Search and actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Search */}
        <div className="relative w-64 hidden md:block">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isMixed ? "text-sidebar-foreground/70" : "text-muted-foreground")} />
          <Input
            placeholder="Buscar..."
            className={cn("pl-10 border-0 focus-visible:ring-1 focus-visible:ring-primary/30", isMixed ? "bg-sidebar-accent/50 text-sidebar-foreground placeholder:text-sidebar-foreground/50" : "bg-secondary")}
          />
        </div>

        {/* Mobile search */}
        <Button variant="ghost" size="icon" className={cn("md:hidden", topbarMuted)}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme: botão cicla Claro → Médio → Escuro → Claro */}
        <Button
          variant="ghost"
          size="icon"
          className={topbarMuted}
          onClick={() => onThemeChange(nextTheme(theme))}
          title={`Tema: ${theme === "light" ? "Claro" : theme === "mixed" ? "Médio" : "Escuro"} (clique para trocar)`}
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Contrast className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={cn("relative", topbarMuted)}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">Nova oportunidade criada</span>
              <span className="text-xs text-muted-foreground">Há 5 minutos</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">Reunião agendada confirmada</span>
              <span className="text-xs text-muted-foreground">Há 1 hora</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">Meta mensal atingida</span>
              <span className="text-xs text-muted-foreground">Há 3 horas</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn("flex items-center gap-2 px-2", isMixed ? "hover:bg-sidebar-accent/50 text-sidebar-foreground" : "hover:bg-secondary")}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className={cn("hidden lg:block text-sm font-medium", isMixed ? "text-sidebar-foreground" : "text-foreground")}>
                {getUserName()}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{getUserName()}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/configuracoes/geral")}>
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/configuracoes/geral")}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
