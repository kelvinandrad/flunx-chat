import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  Users,
  ArrowDown,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  dropRate: number;
  avgTime: string;
  isBottleneck: boolean;
  heatLevel: "low" | "medium" | "high" | "critical";
}

const funnelStages: FunnelStage[] = [
  { id: "1", name: "Visitantes", count: 10000, dropRate: 0, avgTime: "-", isBottleneck: false, heatLevel: "low" },
  { id: "2", name: "Leads Capturados", count: 2500, dropRate: 75, avgTime: "2min", isBottleneck: false, heatLevel: "medium" },
  { id: "3", name: "MQL", count: 1200, dropRate: 52, avgTime: "3 dias", isBottleneck: false, heatLevel: "medium" },
  { id: "4", name: "SQL", count: 450, dropRate: 62.5, avgTime: "5 dias", isBottleneck: true, heatLevel: "critical" },
  { id: "5", name: "Proposta Enviada", count: 280, dropRate: 37.8, avgTime: "7 dias", isBottleneck: true, heatLevel: "high" },
  { id: "6", name: "Negociação", count: 180, dropRate: 35.7, avgTime: "10 dias", isBottleneck: false, heatLevel: "medium" },
  { id: "7", name: "Fechado Ganho", count: 120, dropRate: 33.3, avgTime: "3 dias", isBottleneck: false, heatLevel: "low" },
];

const bottlenecks = [
  {
    id: 1,
    stage: "MQL → SQL",
    dropRate: 62.5,
    impact: "Alto",
    potentialRevenue: "R$ 450.000",
    suggestion: "Melhorar critérios de qualificação e SDR response time",
  },
  {
    id: 2,
    stage: "SQL → Proposta",
    dropRate: 37.8,
    impact: "Médio",
    potentialRevenue: "R$ 180.000",
    suggestion: "Automatizar geração de propostas e follow-up",
  },
  {
    id: 3,
    stage: "Visitantes → Leads",
    dropRate: 75,
    impact: "Médio",
    potentialRevenue: "R$ 320.000",
    suggestion: "Otimizar landing pages e CTAs",
  },
];

const getHeatColor = (level: string) => {
  switch (level) {
    case "low": return "bg-green-500/20 border-green-500/30";
    case "medium": return "bg-amber-500/20 border-amber-500/30";
    case "high": return "bg-orange-500/20 border-orange-500/30";
    case "critical": return "bg-red-500/20 border-red-500/30";
    default: return "bg-muted";
  }
};

const getHeatTextColor = (level: string) => {
  switch (level) {
    case "low": return "text-green-500";
    case "medium": return "text-amber-500";
    case "high": return "text-orange-500";
    case "critical": return "text-red-500";
    default: return "text-muted-foreground";
  }
};

export default function BottleneckAnalysis() {
  const totalConversion = ((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100).toFixed(1);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Análise de Gargalos</h1>
            <p className="text-muted-foreground mt-1">
              Identifique pontos de perda e oportunidades de otimização
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="acquisition">
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecionar funil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acquisition">Funil de Aquisição</SelectItem>
                <SelectItem value="onboarding">Funil de Onboarding</SelectItem>
                <SelectItem value="upsell">Funil de Upsell</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30d">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">2</p>
                  <p className="text-sm text-muted-foreground">Gargalos Críticos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">62.5%</p>
                  <p className="text-sm text-muted-foreground">Maior Drop-off</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">30 dias</p>
                  <p className="text-sm text-muted-foreground">Tempo Médio Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{totalConversion}%</p>
                  <p className="text-sm text-muted-foreground">Conversão Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Heatmap Visualization */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Visualização do Funil (Heatmap)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
              {funnelStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  {/* Stage Block */}
                  <div
                    className={cn(
                      "relative min-w-[140px] p-4 rounded-lg border-2 transition-all",
                      getHeatColor(stage.heatLevel),
                      stage.isBottleneck && "ring-2 ring-red-500 ring-offset-2 ring-offset-background"
                    )}
                  >
                    {stage.isBottleneck && (
                      <div className="absolute -top-2 -right-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-foreground mb-2">{stage.name}</p>
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-lg font-semibold text-foreground">
                        {stage.count.toLocaleString()}
                      </span>
                    </div>
                    {index > 0 && (
                      <div className="flex items-center gap-2">
                        <div className={cn("flex items-center gap-1", getHeatTextColor(stage.heatLevel))}>
                          <ArrowDown className="h-3.5 w-3.5" />
                          <span className="text-sm font-medium">{stage.dropRate}%</span>
                        </div>
                        <span className="text-xs text-muted-foreground">drop</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{stage.avgTime}</span>
                    </div>
                  </div>
                  
                  {/* Arrow Connector */}
                  {index < funnelStages.length - 1 && (
                    <div className="flex-shrink-0 mx-1">
                      <ArrowRight className="h-5 w-5 text-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-green-500/20 border border-green-500/30" />
                <span className="text-xs text-muted-foreground">Baixo (&lt;30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-amber-500/20 border border-amber-500/30" />
                <span className="text-xs text-muted-foreground">Médio (30-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-orange-500/20 border border-orange-500/30" />
                <span className="text-xs text-muted-foreground">Alto (50-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-red-500/20 border border-red-500/30" />
                <span className="text-xs text-muted-foreground">Crítico (&gt;60%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottleneck Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {bottlenecks.map((bottleneck) => (
            <Card key={bottleneck.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{bottleneck.stage}</CardTitle>
                  <Badge 
                    variant={bottleneck.impact === "Alto" ? "destructive" : "secondary"}
                    className={bottleneck.impact === "Alto" ? "bg-red-500/10 text-red-500" : ""}
                  >
                    {bottleneck.impact}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Perda</p>
                    <p className="text-xl font-semibold text-red-500">{bottleneck.dropRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Potencial</p>
                    <p className="text-xl font-semibold text-primary">{bottleneck.potentialRevenue}</p>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Sugestão</p>
                  <p className="text-sm text-foreground">{bottleneck.suggestion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Time Analysis */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Tempo Médio por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelStages.slice(1).map((stage) => {
                const timeValue = parseInt(stage.avgTime) || 0;
                const maxTime = 10;
                const width = Math.min((timeValue / maxTime) * 100, 100);
                
                return (
                  <div key={stage.id} className="flex items-center gap-4">
                    <div className="w-32 flex-shrink-0">
                      <span className="text-sm text-foreground">{stage.name}</span>
                    </div>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          stage.isBottleneck ? "bg-red-500" : "bg-primary"
                        )}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-sm font-medium text-foreground">{stage.avgTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
