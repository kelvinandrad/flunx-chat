import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  GitBranch,
  Users,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const funnels = [
  {
    id: 1,
    name: "Funil de Aquisição Principal",
    status: "active",
    activePeople: 1284,
    conversions: 342,
    conversionRate: 26.6,
    bottleneck: "Etapa de Qualificação → Proposta",
    stages: 6,
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    name: "Funil de Onboarding",
    status: "active",
    activePeople: 856,
    conversions: 712,
    conversionRate: 83.2,
    bottleneck: "Ativação do Produto",
    stages: 4,
    lastUpdated: "2024-01-14",
  },
  {
    id: 3,
    name: "Funil de Upsell Enterprise",
    status: "draft",
    activePeople: 0,
    conversions: 0,
    conversionRate: 0,
    bottleneck: "-",
    stages: 5,
    lastUpdated: "2024-01-12",
  },
  {
    id: 4,
    name: "Funil de Reativação",
    status: "active",
    activePeople: 423,
    conversions: 89,
    conversionRate: 21.0,
    bottleneck: "Primeiro Contato → Resposta",
    stages: 5,
    lastUpdated: "2024-01-10",
  },
  {
    id: 5,
    name: "Funil de Indicação",
    status: "active",
    activePeople: 156,
    conversions: 67,
    conversionRate: 42.9,
    bottleneck: "Convite Enviado → Cadastro",
    stages: 3,
    lastUpdated: "2024-01-08",
  },
];

export default function FunnelsList() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Funis</h1>
            <p className="text-muted-foreground mt-1">
              Mapeamento visual de conversão e jornada
            </p>
          </div>
          <Button onClick={() => navigate("/funis/editor")}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Funil
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">5</p>
                  <p className="text-sm text-muted-foreground">Funis Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">2.719</p>
                  <p className="text-sm text-muted-foreground">Pessoas Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">1.210</p>
                  <p className="text-sm text-muted-foreground">Conversões</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Gargalos Críticos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar funis..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Funnels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnels.map((funnel) => (
            <Card
              key={funnel.id}
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => navigate("/funis/editor")}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GitBranch className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {funnel.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {funnel.stages} etapas
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant={funnel.status === "active" ? "default" : "secondary"}
                    className={
                      funnel.status === "active"
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : ""
                    }
                  >
                    {funnel.status === "active" ? "Ativo" : "Rascunho"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {funnel.activePeople.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Pessoas</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {funnel.conversions.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Conversões</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {funnel.conversionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Taxa</p>
                  </div>
                </div>

                {funnel.bottleneck !== "-" && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-muted-foreground truncate">
                        {funnel.bottleneck}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
