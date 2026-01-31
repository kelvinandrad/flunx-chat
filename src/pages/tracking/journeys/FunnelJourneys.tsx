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
import { ArrowDown, Clock, Users, TrendingDown } from "lucide-react";

const funnelStages = [
  {
    name: "Visitante",
    entries: 12450,
    exits: 8200,
    remaining: 4250,
    avgTime: "2 min",
    dropRate: 65.9,
  },
  {
    name: "Lead",
    entries: 4250,
    exits: 2100,
    remaining: 2150,
    avgTime: "1.2 dias",
    dropRate: 49.4,
  },
  {
    name: "Qualificado",
    entries: 2150,
    exits: 950,
    remaining: 1200,
    avgTime: "2.5 dias",
    dropRate: 44.2,
  },
  {
    name: "Proposta",
    entries: 1200,
    exits: 420,
    remaining: 780,
    avgTime: "3.1 dias",
    dropRate: 35.0,
  },
  {
    name: "Negociação",
    entries: 780,
    exits: 180,
    remaining: 600,
    avgTime: "4.2 dias",
    dropRate: 23.1,
  },
  {
    name: "Cliente",
    entries: 600,
    exits: 0,
    remaining: 600,
    avgTime: "-",
    dropRate: 0,
  },
];

export default function FunnelJourneys() {
  const totalConversions = funnelStages[funnelStages.length - 1].remaining;
  const totalEntries = funnelStages[0].entries;
  const conversionRate = ((totalConversions / totalEntries) * 100).toFixed(1);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Jornadas por Funil
            </h1>
            <p className="text-sm text-muted-foreground">
              Análise agregada de entradas, saídas e tempo por etapa
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select defaultValue="vendas">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Funil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendas">Funil de Vendas</SelectItem>
                <SelectItem value="trial">Funil Trial</SelectItem>
                <SelectItem value="enterprise">Funil Enterprise</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="30d">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Entradas
                  </p>
                  <p className="text-2xl font-semibold">
                    {totalEntries.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-success rotate-180" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversões</p>
                  <p className="text-2xl font-semibold">
                    {totalConversions.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Taxa de Conversão
                  </p>
                  <p className="text-2xl font-semibold">{conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Funil de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelStages.map((stage, index) => {
                const widthPercent =
                  (stage.remaining / funnelStages[0].entries) * 100;
                const isLast = index === funnelStages.length - 1;

                return (
                  <div key={stage.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">
                          {stage.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {stage.remaining.toLocaleString()} pessoas
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {stage.avgTime}
                        </div>
                        {!isLast && (
                          <div className="flex items-center gap-1 text-destructive">
                            <TrendingDown className="h-3.5 w-3.5" />
                            {stage.dropRate}% saída
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="w-full h-10 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-lg transition-all flex items-center justify-center"
                          style={{
                            width: `${Math.max(widthPercent, 5)}%`,
                          }}
                        >
                          <span className="text-xs font-medium text-primary-foreground">
                            {widthPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isLast && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Detalhamento por Etapa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Etapa
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Entradas
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Saídas
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Restantes
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tempo Médio
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Taxa de Saída
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {funnelStages.map((stage) => (
                    <tr
                      key={stage.name}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <span className="font-medium text-foreground">
                          {stage.name}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          {stage.entries.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          {stage.exits.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          {stage.remaining.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-muted-foreground">
                          {stage.avgTime}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {stage.dropRate > 0 ? (
                          <span className="text-destructive">
                            {stage.dropRate}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
