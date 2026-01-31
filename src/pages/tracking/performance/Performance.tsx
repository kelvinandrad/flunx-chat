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
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceProps {
  title: string;
  description: string;
  data: {
    name: string;
    volume: number;
    conversions: number;
    revenue: number;
    efficiency: number;
    trend: "up" | "down" | "neutral";
  }[];
}

function PerformanceView({ title, description, data }: PerformanceProps) {
  const chartData = data.map((item) => ({
    name: item.name.length > 15 ? `${item.name.slice(0, 15)}...` : item.name,
    fullName: item.name,
    volume: item.volume,
    conversions: item.conversions,
    revenue: item.revenue,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Select defaultValue="linear">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Touch</SelectItem>
                <SelectItem value="last">Last Touch</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
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

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Receita Atribuída
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "revenue")
                        return [`R$ ${value.toLocaleString()}`, "Receita"];
                      return [value.toLocaleString(), name];
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Detalhamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Conversões
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Receita
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Eficiência
                    </th>
                    <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tendência
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((item) => (
                    <tr
                      key={item.name}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <span className="font-medium text-foreground">
                          {item.name}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          {item.volume.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          {item.conversions.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          R$ {item.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${item.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.efficiency}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        {item.trend === "up" && (
                          <Badge className="bg-success/10 text-success">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Alta
                          </Badge>
                        )}
                        {item.trend === "down" && (
                          <Badge className="bg-destructive/10 text-destructive">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Baixa
                          </Badge>
                        )}
                        {item.trend === "neutral" && (
                          <Badge variant="secondary">Estável</Badge>
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

// Performance By Channel
export function PerformanceByChannel() {
  const data = [
    { name: "Google Ads", volume: 4820, conversions: 342, revenue: 185400, efficiency: 94, trend: "up" as const },
    { name: "Meta Ads", volume: 3650, conversions: 256, revenue: 124800, efficiency: 87, trend: "up" as const },
    { name: "Orgânico", volume: 2890, conversions: 189, revenue: 78500, efficiency: 82, trend: "neutral" as const },
    { name: "Email", volume: 890, conversions: 67, revenue: 28900, efficiency: 76, trend: "down" as const },
    { name: "Direto", volume: 1240, conversions: 38, revenue: 10900, efficiency: 65, trend: "neutral" as const },
  ];

  return (
    <PerformanceView
      title="Performance por Canal"
      description="Análise de performance atribuída por canal de aquisição"
      data={data}
    />
  );
}

// Performance By Campaign
export function PerformanceByCampaign() {
  const data = [
    { name: "Black Friday 2024", volume: 2450, conversions: 186, revenue: 98400, efficiency: 92, trend: "up" as const },
    { name: "Remarketing Carrinho", volume: 1890, conversions: 124, revenue: 67200, efficiency: 88, trend: "up" as const },
    { name: "Prospecção Lookalike", volume: 3200, conversions: 98, revenue: 52100, efficiency: 72, trend: "down" as const },
    { name: "Webinar Dezembro", volume: 890, conversions: 78, revenue: 41800, efficiency: 85, trend: "neutral" as const },
    { name: "Newsletter Mensal", volume: 560, conversions: 45, revenue: 24500, efficiency: 78, trend: "neutral" as const },
    { name: "LinkedIn B2B", volume: 420, conversions: 34, revenue: 89500, efficiency: 95, trend: "up" as const },
  ];

  return (
    <PerformanceView
      title="Performance por Campanha"
      description="Análise de performance atribuída por campanha"
      data={data}
    />
  );
}

// Performance By Offer
export function PerformanceByOffer() {
  const data = [
    { name: "Plano Pro Anual", volume: 1200, conversions: 130, revenue: 156000, efficiency: 94, trend: "up" as const },
    { name: "Plano Enterprise", volume: 180, conversions: 40, revenue: 120000, efficiency: 96, trend: "up" as const },
    { name: "Plano Pro Mensal", volume: 2400, conversions: 297, revenue: 89100, efficiency: 82, trend: "neutral" as const },
    { name: "Plano Starter", volume: 3200, conversions: 214, revenue: 42800, efficiency: 68, trend: "down" as const },
    { name: "Add-on Premium", volume: 890, conversions: 103, revenue: 20600, efficiency: 75, trend: "neutral" as const },
  ];

  return (
    <PerformanceView
      title="Performance por Oferta"
      description="Análise de performance atribuída por oferta"
      data={data}
    />
  );
}

// Performance By AI Agent
export function PerformanceByAgent() {
  const data = [
    { name: "Agente Vendas", volume: 2450, conversions: 245, revenue: 132800, efficiency: 92, trend: "up" as const },
    { name: "Agente Suporte", volume: 1890, conversions: 89, revenue: 48200, efficiency: 78, trend: "neutral" as const },
    { name: "Agente Qualificação", volume: 3200, conversions: 312, revenue: 89400, efficiency: 85, trend: "up" as const },
    { name: "Agente Agendamento", volume: 890, conversions: 156, revenue: 67800, efficiency: 88, trend: "up" as const },
    { name: "Orquestrador", volume: 8430, conversions: 802, revenue: 338200, efficiency: 90, trend: "up" as const },
  ];

  return (
    <PerformanceView
      title="Performance por Agente de IA"
      description="Análise de performance atribuída por agente de IA"
      data={data}
    />
  );
}

export default PerformanceByChannel;
