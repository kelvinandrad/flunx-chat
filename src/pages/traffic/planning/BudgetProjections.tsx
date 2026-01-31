import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Target,
  MousePointer,
  Calendar,
  Calculator,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useState } from "react";

const projectionData = [
  { month: "Jan", investment: 15000, projected: 45, actual: 42 },
  { month: "Fev", investment: 18000, projected: 54, actual: 51 },
  { month: "Mar", investment: 22000, projected: 66, actual: 68 },
  { month: "Abr", investment: 25000, projected: 75, actual: null },
  { month: "Mai", investment: 28000, projected: 84, actual: null },
  { month: "Jun", investment: 30000, projected: 90, actual: null },
];

const channelAllocation = [
  { channel: "Google Search", percentage: 40, amount: 12000 },
  { channel: "Meta Ads", percentage: 35, amount: 10500 },
  { channel: "Google Display", percentage: 15, amount: 4500 },
  { channel: "YouTube", percentage: 10, amount: 3000 },
];

export default function BudgetProjections() {
  const [dailyBudget, setDailyBudget] = useState([1000]);
  const [monthlyBudget, setMonthlyBudget] = useState([30000]);

  const estimatedClicks = Math.round(dailyBudget[0] / 2.5);
  const estimatedConversions = Math.round(estimatedClicks * 0.032);
  const estimatedCPA = dailyBudget[0] / Math.max(estimatedConversions, 1);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Orçamento & Projeções
            </h1>
            <p className="text-sm text-muted-foreground">
              Planejamento financeiro para mídia paga
            </p>
          </div>

          <Select defaultValue="q1">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1">Q1 2024</SelectItem>
              <SelectItem value="q2">Q2 2024</SelectItem>
              <SelectItem value="q3">Q3 2024</SelectItem>
              <SelectItem value="q4">Q4 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Orçamento Diário
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    R$ {dailyBudget[0].toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ajustável via slider
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Orçamento Mensal
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    R$ {monthlyBudget[0].toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(monthlyBudget[0] / 30).toFixed(0)}/dia em média
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Cliques Estimados
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {estimatedClicks.toLocaleString()}/dia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CPC médio: R$ 2.50
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MousePointer className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Conversões Estimadas
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {estimatedConversions}/dia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CPA: R$ {estimatedCPA.toFixed(2)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Sliders */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Simulador de Orçamento Diário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Orçamento diário
                  </span>
                  <span className="font-medium">
                    R$ {dailyBudget[0].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={dailyBudget}
                  onValueChange={setDailyBudget}
                  max={5000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R$ 100</span>
                  <span>R$ 5.000</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Cliques estimados
                  </span>
                  <span className="font-medium">
                    ~{estimatedClicks.toLocaleString()}/dia
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Conversões estimadas
                  </span>
                  <span className="font-medium">~{estimatedConversions}/dia</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">CPA estimado</span>
                  <span className="font-medium">
                    R$ {estimatedCPA.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Alocação por Canal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {channelAllocation.map((channel) => (
                <div key={channel.channel} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{channel.channel}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {channel.percentage}%
                      </span>
                      <span className="text-sm font-medium">
                        R$ {channel.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${channel.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Projection Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Projeção: Investimento vs Resultados
            </CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Projetado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Realizado</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient
                      id="colorProjected"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    yAxisId="left"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="investment"
                    stroke="hsl(var(--muted-foreground))"
                    fill="none"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="projected"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorProjected)"
                    strokeWidth={2}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--success))"
                    fill="none"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
