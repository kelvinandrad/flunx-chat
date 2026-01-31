import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Brain,
  Calendar,
  Package,
  MessageSquare,
  Plug,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Eye,
  UserCircle,
  Layers,
  Upload,
  GitBranch,
  Kanban,
  Target,
  Bot,
  Workflow,
  CalendarDays,
  Clock,
  ShoppingBag,
  CreditCard,
  Radio,
  History,
  Code,
  FileSignature,
  Building2,
  ShieldCheck,
  Receipt,
  Megaphone,
  LineChart,
  Route,
  Fingerprint,
  Mail,
  MessageCircle,
  Globe,
  Zap,
  DollarSign,
  TrendingUp,
  Link,
  MapPin,
  PieChart,
  Wallet,
  FileCheck,
  LayoutGrid,
  Sparkles,
  MessagesSquare,
  Instagram,
  Send,
  Tag,
  Network,
  Activity,
  Share2,
  Split,
  BadgeDollarSign,
  CalendarCheck,
  Video,
  CreditCardIcon,
  ScrollText,
  Cog,
  Palette,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
}

interface SubMenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: SubMenuItem[];
}

interface MenuModule {
  title: string;
  items: MenuItem[];
}

const menuModules: MenuModule[] = [
  {
    title: "Dashboard",
    items: [
      {
        icon: LayoutDashboard,
        label: "Visão Geral",
        href: "/",
      },
    ],
  },
  {
    title: "Pessoas",
    items: [
      {
        icon: Users,
        label: "Gestão de Pessoas",
        href: "/pessoas",
      },
      {
        icon: Fingerprint,
        label: "Perfis & Identidades",
        href: "/pessoas/perfis",
      },
      {
        icon: Route,
        label: "Histórico & Jornada",
        href: "/pessoas/historico",
      },
    ],
  },
  {
    title: "Comercial (CRM)",
    items: [
      {
        icon: Target,
        label: "Oportunidades",
        href: "/comercial/oportunidades",
      },
      {
        icon: Kanban,
        label: "Pipeline Operacional",
        href: "/comercial/kanban",
      },
      {
        icon: Activity,
        label: "Atividades",
        href: "/comercial/atividades",
      },
      {
        icon: Users,
        label: "Vendedores & Times",
        href: "/comercial/vendedores",
      },
    ],
  },
  {
    title: "Funis & Jornadas",
    items: [
      {
        icon: GitBranch,
        label: "Funis",
        href: "/funis",
      },
      {
        icon: Workflow,
        label: "Editor de Funil",
        href: "/funis/editor",
      },
      {
        icon: Route,
        label: "Jornadas",
        href: "/funis/jornadas",
      },
      {
        icon: Split,
        label: "Análise de Gargalos",
        href: "/funis/gargalos",
      },
      {
        icon: Share2,
        label: "Atribuição por Funil",
        href: "/funis/atribuicao",
      },
    ],
  },
  {
    title: "Comunicação",
    items: [
      {
        icon: LayoutDashboard,
        label: "Visão Geral",
        href: "/comunicacao",
      },
      {
        icon: Brain,
        label: "Inteligência Artificial",
        children: [
          { icon: Bot, label: "Agentes", href: "/comunicacao/ia/agentes" },
          { icon: Sparkles, label: "Orquestrador", href: "/comunicacao/ia/orquestrador" },
        ],
      },
      {
        icon: Workflow,
        label: "Fluxos de Comunicação",
        href: "/comunicacao/fluxos",
      },
      {
        icon: MessageSquare,
        label: "Canais",
        href: "/comunicacao/canais",
      },
      {
        icon: MessagesSquare,
        label: "Conversas",
        href: "/comunicacao/conversas",
      },
      {
        icon: BarChart3,
        label: "Performance",
        href: "/comunicacao/performance",
      },
    ],
  },
  {
    title: "Produtos & Ofertas",
    items: [
      {
        icon: Package,
        label: "Catálogo",
        children: [
          { icon: ShoppingBag, label: "Produtos", href: "/produtos/catalogo/produtos" },
          { icon: Briefcase, label: "Serviços", href: "/produtos/catalogo/servicos" },
        ],
      },
      {
        icon: Tag,
        label: "Ofertas",
        children: [
          { icon: Zap, label: "Ofertas Ativas", href: "/produtos/ofertas/ativas" },
          { icon: History, label: "Ofertas Arquivadas", href: "/produtos/ofertas/arquivadas" },
        ],
      },
      {
        icon: DollarSign,
        label: "Precificação",
        children: [
          { icon: CreditCard, label: "Planos & Recorrência", href: "/produtos/precificacao/planos" },
          { icon: Receipt, label: "Condições de Pagamento", href: "/produtos/precificacao/condicoes" },
        ],
      },
      {
        icon: Layers,
        label: "Bundles & Combos",
        href: "/produtos/bundles",
      },
      {
        icon: Link,
        label: "Integrações",
        children: [
          { icon: GitBranch, label: "Funis", href: "/produtos/integracoes/funis" },
          { icon: Bot, label: "Comunicação / IA", href: "/produtos/integracoes/ia" },
          { icon: Megaphone, label: "Ads & Campanhas", href: "/produtos/integracoes/ads" },
        ],
      },
      {
        icon: PieChart,
        label: "Performance",
        children: [
          { icon: LineChart, label: "Visão Geral", href: "/produtos/performance" },
          { icon: Split, label: "Testes A/B de Ofertas", href: "/produtos/performance/ab-tests" },
        ],
      },
    ],
  },
  {
    title: "Tráfego & Ads",
    items: [
      {
        icon: LayoutDashboard,
        label: "Visão Geral",
        href: "/trafego",
      },
      {
        icon: Building2,
        label: "Contas & Plataformas",
        href: "/trafego/contas",
      },
      {
        icon: Megaphone,
        label: "Campanhas",
        children: [
          { icon: Megaphone, label: "Campanhas", href: "/trafego/campanhas" },
          { icon: LayoutGrid, label: "Grupos / Conjuntos", href: "/trafego/grupos" },
          { icon: Radio, label: "Anúncios", href: "/trafego/anuncios" },
        ],
      },
      {
        icon: Target,
        label: "Planejamento",
        children: [
          { icon: FileText, label: "Palavras-chave", href: "/trafego/planejamento/keywords" },
          { icon: Users, label: "Públicos & Segmentações", href: "/trafego/planejamento/publicos" },
          { icon: DollarSign, label: "Orçamento & Projeções", href: "/trafego/planejamento/orcamento" },
        ],
      },
      {
        icon: Sparkles,
        label: "IA & Otimização",
        href: "/trafego/ia",
      },
    ],
  },
  {
    title: "Traqueamento & Atribuição",
    items: [
      {
        icon: LayoutDashboard,
        label: "Visão Geral",
        children: [
          { icon: PieChart, label: "Panorama de Atribuição", href: "/traqueamento" },
        ],
      },
      {
        icon: MapPin,
        label: "Origens & UTMs",
        children: [
          { icon: Globe, label: "Fontes & Canais", href: "/traqueamento/origens/fontes" },
          { icon: Megaphone, label: "Campanhas", href: "/traqueamento/origens/campanhas" },
          { icon: Link, label: "Gerador de UTMs", href: "/traqueamento/origens/utm" },
        ],
      },
      {
        icon: Activity,
        label: "Eventos",
        children: [
          { icon: Zap, label: "Eventos Padrão", href: "/traqueamento/eventos/padrao" },
          { icon: Sparkles, label: "Eventos Customizados", href: "/traqueamento/eventos/custom" },
          { icon: Clock, label: "Linha do Tempo", href: "/traqueamento/eventos/timeline" },
        ],
      },
      {
        icon: Route,
        label: "Jornadas",
        children: [
          { icon: Users, label: "Jornadas de Pessoas", href: "/traqueamento/jornadas/pessoas" },
          { icon: GitBranch, label: "Jornadas por Funil", href: "/traqueamento/jornadas/funil" },
          { icon: Network, label: "Análise de Caminhos", href: "/traqueamento/jornadas/caminhos" },
        ],
      },
      {
        icon: Target,
        label: "Atribuição",
        children: [
          { icon: Layers, label: "Modelos de Atribuição", href: "/traqueamento/atribuicao/modelos" },
          { icon: Split, label: "Comparação de Modelos", href: "/traqueamento/atribuicao/comparacao" },
          { icon: DollarSign, label: "Receita & Conversões", href: "/traqueamento/atribuicao/receita" },
        ],
      },
      {
        icon: BarChart3,
        label: "Performance",
        children: [
          { icon: Globe, label: "Por Canal", href: "/traqueamento/performance/canal" },
          { icon: Megaphone, label: "Por Campanha", href: "/traqueamento/performance/campanha" },
          { icon: Tag, label: "Por Oferta", href: "/traqueamento/performance/oferta" },
          { icon: Bot, label: "Por Agente de IA", href: "/traqueamento/performance/agente" },
        ],
      },
    ],
  },
  {
    title: "Agendamentos",
    items: [
      {
        icon: LayoutDashboard,
        label: "Visão Geral",
        href: "/agendamentos",
      },
      {
        icon: CalendarDays,
        label: "Eventos",
        children: [
          { icon: Layers, label: "Todos os Eventos", href: "/agendamentos/eventos" },
          { icon: MessageCircle, label: "Follow-ups", href: "/agendamentos/eventos/followups" },
          { icon: Video, label: "Reuniões", href: "/agendamentos/eventos/reunioes" },
          { icon: Clock, label: "Prazos", href: "/agendamentos/eventos/prazos" },
        ],
      },
      {
        icon: Calendar,
        label: "Calendário",
        children: [
          { icon: Clock, label: "Dia", href: "/agendamentos/calendario/dia" },
          { icon: CalendarDays, label: "Semana", href: "/agendamentos/calendario/semana" },
          { icon: LayoutGrid, label: "Mês", href: "/agendamentos/calendario/mes" },
          { icon: FileText, label: "Agenda (Lista)", href: "/agendamentos/calendario/agenda" },
        ],
      },
      {
        icon: Target,
        label: "Próximos Passos",
        href: "/agendamentos/proximos-passos",
      },
      {
        icon: Zap,
        label: "Automação",
        children: [
          { icon: Workflow, label: "Regras de Follow-up", href: "/agendamentos/automacao/regras" },
          { icon: CalendarCheck, label: "Confirmações", href: "/agendamentos/automacao/confirmacoes" },
          { icon: Clock, label: "Lembretes", href: "/agendamentos/automacao/lembretes" },
        ],
      },
      {
        icon: Users,
        label: "Recursos",
        children: [
          { icon: UserCircle, label: "Agendas (Pessoas)", href: "/agendamentos/recursos/agendas" },
          { icon: MapPin, label: "Locais", href: "/agendamentos/recursos/locais" },
          { icon: Tag, label: "Tipos de Evento", href: "/agendamentos/recursos/tipos" },
        ],
      },
      {
        icon: Plug,
        label: "Integrações",
        children: [
          { icon: Calendar, label: "Google Calendar", href: "/agendamentos/integracoes/google-calendar" },
          { icon: Video, label: "Google Meet", href: "/agendamentos/integracoes/google-meet" },
        ],
      },
    ],
  },
  {
    title: "Formalização & Receita",
    items: [
      {
        icon: LayoutDashboard,
        label: "Visão Geral",
        href: "/formalizacao",
      },
      {
        icon: FileSignature,
        label: "Processos",
        children: [
          { icon: Layers, label: "Todos os Processos", href: "/formalizacao/processos" },
          { icon: Clock, label: "Em Formalização", href: "/formalizacao/processos/formalizacao" },
          { icon: CreditCard, label: "Aguardando Pagamento", href: "/formalizacao/processos/pagamento" },
          { icon: FileCheck, label: "Concluídos", href: "/formalizacao/processos/concluidos" },
        ],
      },
      {
        icon: FileText,
        label: "Documentos",
        children: [
          { icon: ScrollText, label: "Todos os Documentos", href: "/formalizacao/documentos" },
          { icon: Code, label: "Templates", href: "/formalizacao/documentos/templates" },
        ],
      },
      {
        icon: Wallet,
        label: "Cobranças",
        children: [
          { icon: Receipt, label: "Todas as Cobranças", href: "/formalizacao/cobrancas" },
          { icon: Clock, label: "Pagamentos Pendentes", href: "/formalizacao/cobrancas/pendentes" },
          { icon: BadgeDollarSign, label: "Pagamentos Recebidos", href: "/formalizacao/cobrancas/recebidos" },
        ],
      },
      {
        icon: Zap,
        label: "Automação",
        children: [
          { icon: Workflow, label: "Regras Administrativas", href: "/formalizacao/automacao/regras" },
          { icon: MessageCircle, label: "Follow-ups", href: "/formalizacao/automacao/followups" },
        ],
      },
      {
        icon: Plug,
        label: "Integrações",
        children: [
          { icon: FileCheck, label: "Autentique", href: "/formalizacao/integracoes/autentique" },
          { icon: CreditCardIcon, label: "Stripe", href: "/formalizacao/integracoes/stripe" },
          { icon: Wallet, label: "Asaas", href: "/formalizacao/integracoes/asaas" },
        ],
      },
    ],
  },
  {
    title: "Configurações",
    items: [
      {
        icon: Cog,
        label: "Geral",
        href: "/configuracoes/geral",
      },
      {
        icon: Building2,
        label: "Empresa",
        href: "/configuracoes/empresa",
      },
      {
        icon: Palette,
        label: "Identidade Visual",
        href: "/configuracoes/identidade-visual",
      },
      {
        icon: Users,
        label: "Usuários & Permissões",
        href: "/configuracoes/usuarios",
      },
      {
        icon: Brain,
        label: "Inteligência Artificial",
        href: "/configuracoes/ia",
      },
      {
        icon: FileText,
        label: "Conhecimento & Playbooks",
        href: "/configuracoes/conhecimento",
      },
      {
        icon: MessageSquare,
        label: "Comunicação",
        href: "/configuracoes/comunicacao",
      },
      {
        icon: Calendar,
        label: "Agendamentos",
        href: "/configuracoes/agendamentos",
      },
      {
        icon: GitBranch,
        label: "Funis & Jornadas",
        href: "/configuracoes/funis",
      },
      {
        icon: FileSignature,
        label: "Formalização & Receita",
        href: "/configuracoes/formalizacao",
      },
      {
        icon: Activity,
        label: "Traqueamento & Atribuição",
        href: "/configuracoes/traqueamento",
      },
      {
        icon: Plug,
        label: "Integrações",
        href: "/configuracoes/integracoes",
      },
      {
        icon: ShieldCheck,
        label: "Segurança & Logs",
        href: "/configuracoes/seguranca",
      },
    ],
  },
];

export function Sidebar({ isCollapsed }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Gestão de Pessoas"]);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleNavigate = (href: string) => {
    navigate(href);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border px-3 flex-shrink-0",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-base">N</span>
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-sidebar-foreground text-lg">Nexus</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
        {menuModules.map((module, moduleIndex) => (
          <div key={module.title} className={cn(moduleIndex > 0 && "mt-4")}>
            {/* Module Title */}
            {!isCollapsed && (
              <div className="px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {module.title}
                </span>
              </div>
            )}
            
            {isCollapsed && moduleIndex > 0 && (
              <div className="mx-2 my-2 border-t border-sidebar-border" />
            )}

            {/* Module Items */}
            <ul className="space-y-0.5">
              {module.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.label);
                const isActive = item.href ? isActiveRoute(item.href) : false;

                if (isCollapsed) {
                  return (
                    <li key={item.label}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              if (item.href) {
                                handleNavigate(item.href);
                              } else if (hasChildren) {
                                toggleExpand(item.label);
                              }
                            }}
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
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        if (item.href) {
                          handleNavigate(item.href);
                        } else if (hasChildren) {
                          toggleExpand(item.label);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {hasChildren && (
                        <span className="ml-auto">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </button>

                    {/* Children */}
                    {hasChildren && isExpanded && !isCollapsed && (
                      <ul className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border/50 pl-3">
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = isActiveRoute(child.href);

                          return (
                            <li key={child.href}>
                              <button
                                onClick={() => handleNavigate(child.href)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
                                  isChildActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                )}
                              >
                                <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{child.label}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
