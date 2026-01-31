import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  MousePointer,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Play,
  Pause,
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

const kpiCards = [
  {
    title: "Impressões",
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Cliques",
    value: "48.2K",
    change: "+8.3%",
    trend: "up",
    icon: MousePointer,
  },
  {
    title: "CPC Médio",
    value: "R$ 1.24",
    change: "-5.2%",
    trend: "down",
    icon: DollarSign,
  },
  {
    title: "Conversões",
    value: "1.847",
    change: "+15.8%",
    trend: "up",
    icon: Target,
  },
];

const performanceData = [
  { date: "01/01", impressions: 85000, clicks: 1700, conversions: 52 },
  { date: "02/01", impressions: 92000, clicks: 1900, conversions: 61 },
  { date: "03/01", impressions: 78000, clicks: 1500, conversions: 48 },
  { date: "04/01", impressions: 105000, clicks: 2200, conversions: 72 },
  { date: "05/01", impressions: 118000, clicks: 2450, conversions: 85 },
  { date: "06/01", impressions: 95000, clicks: 1980, conversions: 67 },
  { date: "07/01", impressions: 132000, clicks: 2800, conversions: 98 },
];

const platformData = [
  { platform: "Google Ads", spend: 45000, conversions: 890 },
  { platform: "Meta Ads", spend: 32000, conversions: 654 },
  { platform: "LinkedIn", spend: 12000, conversions: 187 },
  { platform: "TikTok", spend: 8500, conversions: 116 },
];

const activeCampaigns = [
  {
    id: 1,
    name: "Campanha Black Friday",
    platform: "Google Ads",
    status: "active",
    budget: "R$ 500/dia",
    clicks: 12450,
    conversions: 342,
  },
  {
    id: 2,
    name: "Remarketing - Carrinho Abandonado",
    platform: "Meta Ads",
    status: "active",
    budget: "R$ 250/dia",
    clicks: 8920,
    conversions: 215,
  },
  {
    id: 3,
    name: "Prospecção - Lookalike",
    platform: "Meta Ads",
    status: "active",
    budget: "R$ 400/dia",
    clicks: 15680,
    conversions: 187,
  },
  {
    id: 4,
    name: "Search - Marca",
    platform: "Google Ads",
    status: "paused",
    budget: "R$ 150/dia",
    clicks: 3240,
    conversions: 98,
  },
];

export default function TrafficOverview() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Tráfego & Ads
            </h1>
            <p className="text-sm text-muted-foreground">
              Visão executiva do seu tráfego pago
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="google">Google Ads</SelectItem>
                <SelectItem value="meta">Meta Ads</SelectItem>
                <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as contas</SelectItem>
                <SelectItem value="main">Conta Principal</SelectItem>
                <SelectItem value="secondary">Conta Secundária</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
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
                        <TrendIcon
                          className={`h-3.5 w-3.5 ${
                            kpi.trend === "up"
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            kpi.trend === "up"
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
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

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Desempenho por Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient
                        id="colorImpressions"
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
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
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
                      type="monotone"
                      dataKey="impressions"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorImpressions)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Investimento por Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      type="number"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="platform"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) =>
                        `R$ ${value.toLocaleString()}`
                      }
                    />
                    <Bar
                      dataKey="spend"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Campanhas Ativas
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              Ver todas
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Campanha
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Plataforma
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Orçamento
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Cliques
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Conversões
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <span className="font-medium text-foreground">
                          {campaign.name}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground">
                          {campaign.platform}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            campaign.status === "active"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : ""
                          }
                        >
                          {campaign.status === "active" ? "Ativo" : "Pausado"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground">
                          {campaign.budget}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          {campaign.clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          {campaign.conversions.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm">
                          {campaign.status === "active" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
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
