import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Filter,
  User,
  DollarSign,
  Clock,
  MoreHorizontal,
  GripVertical,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePipelineStages, useSeedDefaultStages } from "@/hooks/usePipelineStages";
import { useOpportunitiesByStage, useUpdateOpportunity, type OpportunityWithRelations } from "@/hooks/useOpportunities";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";

export default function Pipeline() {
  const navigate = useNavigate();
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [draggedOpp, setDraggedOpp] = useState<OpportunityWithRelations | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const { data: stages = [], isLoading: stagesLoading } = usePipelineStages();
  const { data: opportunitiesByStage = {}, isLoading: oppsLoading } = useOpportunitiesByStage();
  const { data: members = [] } = useOrganizationMembers();
  const updateOpportunity = useUpdateOpportunity();
  const seedStages = useSeedDefaultStages();

  // Seed default stages if none exist
  useEffect(() => {
    if (stages.length === 0 && !seedStages.isPending && !stagesLoading) {
      seedStages.mutate();
    }
  }, [stages.length, stagesLoading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
    }).format(value);
  };

  const handleDragStart = (opp: OpportunityWithRelations) => {
    setDraggedOpp(opp);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (targetStageId: string) => {
    if (!draggedOpp || draggedOpp.stage_id === targetStageId) {
      setDraggedOpp(null);
      setDragOverStage(null);
      return;
    }

    updateOpportunity.mutate({
      id: draggedOpp.id,
      stage_id: targetStageId,
    });

    setDraggedOpp(null);
    setDragOverStage(null);
  };

  const totalValue = Object.values(opportunitiesByStage)
    .flat()
    .reduce((acc, opp) => acc + (opp.value || 0), 0);

  const totalOpportunities = Object.values(opportunitiesByStage)
    .flat()
    .length;

  const getDaysInStage = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isLoading = stagesLoading || oppsLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pipeline Operacional</h1>
            <p className="text-sm text-muted-foreground">
              Visualize e gerencie o fluxo de vendas em tempo real
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-44">
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
            <Button onClick={() => navigate("/comercial/oportunidades/nova")}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Oportunidade
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valor Total</p>
              <p className="font-semibold">{formatCurrency(totalValue)}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Oportunidades</p>
              <p className="font-semibold">{totalOpportunities}</p>
            </div>
          </div>
          {stages.map((stage) => {
            const stageOpps = opportunitiesByStage[stage.id] || [];
            const stageValue = stageOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);
            return (
              <div key={stage.id} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${stage.color || 'bg-muted'}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{stage.name}</p>
                  <p className="font-semibold">{formatCurrency(stageValue)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageOpps = (opportunitiesByStage[stage.id] || []).filter(
              (opp) => ownerFilter === "all" || opp.owner_id === ownerFilter
            );
            const stageValue = stageOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);

            return (
              <div
                key={stage.id}
                className={`min-w-[300px] flex-1 rounded-lg border bg-muted/30 transition-colors ${
                  dragOverStage === stage.id ? "ring-2 ring-primary" : ""
                }`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between border-b bg-card/50 p-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${stage.color || 'bg-muted'}`} />
                    <span className="font-medium">{stage.name}</span>
                    <Badge variant="secondary" className="ml-1">
                      {stageOpps.length}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(stageValue)}
                  </span>
                </div>

                {/* Opportunities */}
                <div className="space-y-2 p-2">
                  {stageOpps.map((opp) => (
                    <Card
                      key={opp.id}
                      draggable
                      onDragStart={() => handleDragStart(opp)}
                      className={`cursor-grab bg-card transition-all hover:shadow-md active:cursor-grabbing ${
                        draggedOpp?.id === opp.id ? "opacity-50" : ""
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                            <div>
                              <button
                                className="font-medium hover:text-primary hover:underline"
                                onClick={() => navigate(`/comercial/oportunidades/${opp.id}`)}
                              >
                                {opp.name}
                              </button>
                              <button
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                                onClick={() => navigate(`/pessoas/${opp.person_id}`)}
                              >
                                <User className="h-3 w-3" />
                                {opp.people?.name || "-"}
                              </button>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem
                                onClick={() => navigate(`/comercial/oportunidades/${opp.id}`)}
                              >
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/pessoas/${opp.person_id}`)}
                              >
                                Ver pessoa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="font-medium text-primary">
                            {formatCurrency(opp.value || 0)}
                          </span>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {getDaysInStage(opp.created_at)}d
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {(opp.profiles?.full_name || "?")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Empty State */}
                  {stageOpps.length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                      Sem oportunidades
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
