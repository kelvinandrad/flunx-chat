import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Workflow, 
  Plus, 
  Search, 
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Trash2,
  Zap,
  MessageSquare,
  GitBranch
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const flows = [
  {
    id: 1,
    name: "Boas-vindas Lead",
    description: "Fluxo automático de onboarding para novos leads",
    trigger: "Entrada em funil",
    status: "active",
    executions: 1234,
    conversions: 45,
    lastEdit: "2 dias atrás"
  },
  {
    id: 2,
    name: "Recuperação de Carrinho",
    description: "Sequência de mensagens para carrinhos abandonados",
    trigger: "Tempo parado",
    status: "active",
    executions: 567,
    conversions: 23,
    lastEdit: "5 dias atrás"
  },
  {
    id: 3,
    name: "Follow-up Proposta",
    description: "Acompanhamento após envio de proposta comercial",
    trigger: "Evento CRM",
    status: "active",
    executions: 234,
    conversions: 18,
    lastEdit: "1 semana atrás"
  },
  {
    id: 4,
    name: "Reativação de Clientes",
    description: "Campanha para clientes inativos há 30+ dias",
    trigger: "Tempo parado",
    status: "paused",
    executions: 89,
    conversions: 7,
    lastEdit: "2 semanas atrás"
  },
  {
    id: 5,
    name: "Pós-Venda",
    description: "Sequência de onboarding pós-compra",
    trigger: "Evento CRM",
    status: "draft",
    executions: 0,
    conversions: 0,
    lastEdit: "Hoje"
  },
];

export default function FlowsList() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Fluxos de Comunicação</h1>
            <p className="text-muted-foreground mt-1">
              Crie automações visuais para engajar pessoas automaticamente
            </p>
          </div>
          <Button onClick={() => navigate('/comunicacao/fluxos/editor')} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Fluxo
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar fluxos..." className="pl-10" />
          </div>
        </div>

        {/* Flows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <Card 
              key={flow.id} 
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/comunicacao/fluxos/editor/${flow.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Workflow className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{flow.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs mt-1 ${
                          flow.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : flow.status === 'paused'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {flow.status === 'active' ? 'Ativo' : flow.status === 'paused' ? 'Pausado' : 'Rascunho'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>
                        {flow.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {flow.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs gap-1">
                    <Zap className="h-3 w-3" />
                    {flow.trigger}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{flow.executions.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">execuções</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{flow.conversions}%</p>
                      <p className="text-xs text-muted-foreground">conversão</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{flow.lastEdit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
