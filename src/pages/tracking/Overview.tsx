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
  Users,
  Target,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Zap,
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
  Sankey,
  Layer,
  Rectangle,
} from "recharts";

const kpiCards = [
  {
    title: "Leads Atribuídos",
    value: "4.827",
    change: "+18.5%",
    icon: Users,
  },
  {
    title: "Conversões Atribuídas",
    value: "892",
    change: "+12.3%",
    icon: Target,
  },
  {
    title: "Receita Atribuída",
    value: "R$ 428.500",
    change: "+24.7%",
    icon: DollarSign,
  },
];

const channelRanking = [
  { channel: "Google Ads", conversions: 342, revenue: 185400, efficiency: 94 },
  { channel: "Meta Ads", conversions: 256, revenue: 124800, efficiency: 87 },
  { channel: "Orgânico", conversions: 189, revenue: 78500, efficiency: 82 },
  { channel: "Email", conversions: 67, revenue: 28900, efficiency: 76 },
  { channel: "Direto", conversions: 38, revenue: 10900, efficiency: 65 },
];

const campaignRanking = [
  { campaign: "Black Friday 2024", conversions: 186, revenue: 98400 },
  { campaign: "Remarketing Carrinho", conversions: 124, revenue: 67200 },
  { campaign: "Prospecção Lookalike", conversions: 98, revenue: 52100 },
  { campaign: "Webinar Dezembro", conversions: 78, revenue: 41800 },
  { campaign: "Newsletter Mensal", conversions: 45, revenue: 24500 },
];

const flowData = [
  { stage: "Origem", google: 2400, meta: 1800, organic: 1200, email: 600 },
  { stage: "Lead", google: 1800, meta: 1400, organic: 900, email: 450 },
  { stage: "Qualificado", google: 900, meta: 700, organic: 450, email: 220 },
  { stage: "Conversão", google: 342, meta: 256, organic: 189, email: 67 },
];

export default function TrackingOverview() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Panorama de Atribuição
            </h1>
            <p className="text-sm text-muted-foreground">
              Visão executiva da performance real do negócio
            </p>
          </div>

          <div className="flex items-center gap-3">
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

            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Funil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os funis</SelectItem>
                <SelectItem value="vendas">Funil de Vendas</SelectItem>
                <SelectItem value="trial">Funil Trial</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="linear">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Touch</SelectItem>
                <SelectItem value="last">Last Touch</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="decay">Time Decay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {kpi.title}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {kpi.value}
                      </p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                        <span className="text-xs font-medium text-success">
                          {kpi.change}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          vs período anterior
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Flow Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Fluxo de Atribuição: Origem → Funil → Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData}>
                  <defs>
                    <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1877F2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34A853" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="stage"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="google"
                    stroke="#4285F4"
                    fill="url(#colorGoogle)"
                    strokeWidth={2}
                    name="Google Ads"
                  />
                  <Area
                    type="monotone"
                    dataKey="meta"
                    stroke="#1877F2"
                    fill="url(#colorMeta)"
                    strokeWidth={2}
                    name="Meta Ads"
                  />
                  <Area
                    type="monotone"
                    dataKey="organic"
                    stroke="#34A853"
                    fill="url(#colorOrganic)"
                    strokeWidth={2}
                    name="Orgânico"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rankings */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Channel Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Canais Mais Eficientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelRanking.map((item, index) => (
                  <div
                    key={item.channel}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.channel}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.conversions} conversões
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        R$ {item.revenue.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.efficiency}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.efficiency}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Campanhas Mais Eficientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignRanking.map((item, index) => (
                  <div
                    key={item.campaign}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.campaign}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.conversions} conversões
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        R$ {item.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
