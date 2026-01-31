import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Kanban,
  User,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Loader2,
} from "lucide-react";
import { useOpportunities } from "@/hooks/useOpportunities";
import { usePipelineStages, useSeedDefaultStages } from "@/hooks/usePipelineStages";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";

const stageColors: Record<string, string> = {
  "Descoberta": "bg-muted text-muted-foreground",
  "Qualificação": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Proposta Enviada": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Negociação": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Fechamento": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function Opportunities() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");

  const { data: stages = [] } = usePipelineStages();
  const { data: members = [] } = useOrganizationMembers();
  const seedStages = useSeedDefaultStages();
  const { data: opportunities = [], isLoading } = useOpportunities({
    stageId: stageFilter !== "all" ? stageFilter : undefined,
    ownerId: ownerFilter !== "all" ? ownerFilter : undefined,
    search: searchTerm || undefined,
  });

  // Seed default stages if none exist
  useEffect(() => {
    if (stages.length === 0 && !seedStages.isPending) {
      seedStages.mutate();
    }
  }, [stages.length]);

  const totalValue = opportunities.reduce((acc, opp) => acc + (opp.value || 0), 0);
  const avgProbability = Math.round(
    opportunities.reduce((acc, opp) => acc + (opp.probability || 0), 0) /
      (opportunities.length || 1)
  );

  const closingOpps = opportunities.filter(
    (o) => o.pipeline_stages?.name === "Fechamento"
  ).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Oportunidades</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as oportunidades comerciais do seu pipeline
            </p>
          </div>
          <Button onClick={() => navigate("/comercial/oportunidades/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-semibold">{opportunities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-semibold">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Probabilidade Média</p>
                  <p className="text-xl font-semibold">{avgProbability}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fechamento Próximo</p>
                  <p className="text-xl font-semibold">{closingOpps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-medium">Lista de Oportunidades</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar oportunidade..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Etapas</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        {member.profiles?.full_name || member.profiles?.email || "Sem nome"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : opportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Nenhuma oportunidade encontrada</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/comercial/oportunidades/nova")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira oportunidade
                </Button>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Oportunidade</TableHead>
                      <TableHead>Pessoa</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">Probabilidade</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Previsão</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => (
                      <TableRow
                        key={opp.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/comercial/oportunidades/${opp.id}`)}
                      >
                        <TableCell className="font-medium">{opp.name}</TableCell>
                        <TableCell>
                          <button
                            className="flex items-center gap-2 text-primary hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/pessoas/${opp.person_id}`);
                            }}
                          >
                            <User className="h-3.5 w-3.5" />
                            {opp.people?.name || "-"}
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={stageColors[opp.pipeline_stages?.name || ""] || ""}
                          >
                            {opp.pipeline_stages?.name || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(opp.value || 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-2 w-16 rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${opp.probability || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {opp.probability || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {opp.profiles?.full_name || opp.profiles?.email || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{opp.origin || "-"}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {opp.expected_close_at
                            ? new Date(opp.expected_close_at).toLocaleDateString("pt-BR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => navigate(`/comercial/oportunidades/${opp.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate("/comercial/kanban")}>
                                <Kanban className="mr-2 h-4 w-4" />
                                Abrir no Kanban
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/pessoas/${opp.person_id}`)}>
                                <User className="mr-2 h-4 w-4" />
                                Acessar Pessoa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
