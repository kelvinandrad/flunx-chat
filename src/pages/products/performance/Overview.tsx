import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Trophy
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";

const metrics = [
  { 
    label: "Receita Total", 
    value: "R$ 456.890", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign
  },
  { 
    label: "Ticket Médio", 
    value: "R$ 2.340", 
    change: "+8.2%", 
    trend: "up",
    icon: ShoppingCart
  },
  { 
    label: "Conversão Média", 
    value: "24.6%", 
    change: "-2.1%", 
    trend: "down",
    icon: TrendingUp
  },
  { 
    label: "Ofertas Ativas", 
    value: "18", 
    change: "+3", 
    trend: "up",
    icon: Tag
  },
];

const offerPerformance = [
  { name: "Enterprise Anual", conversions: 156, revenue: 388440, conversion: 34.5 },
  { name: "Consultoria Express", conversions: 78, revenue: 382200, conversion: 28.2 },
  { name: "Setup Premium", conversions: 89, revenue: 177110, conversion: 45.1 },
  { name: "Professional Mensal", conversions: 234, revenue: 231660, conversion: 22.8 },
  { name: "Treinamento", conversions: 45, revenue: 89100, conversion: 18.5 },
];

const channelRevenue = [
  { channel: "WhatsApp", revenue: 234500 },
  { channel: "Webchat", revenue: 156800 },
  { channel: "Email", revenue: 89400 },
  { channel: "Vendas", revenue: 178900 },
];

const monthlyTrend = [
  { month: "Jan", revenue: 320000 },
  { month: "Fev", revenue: 345000 },
  { month: "Mar", revenue: 378000 },
  { month: "Abr", revenue: 356000 },
  { month: "Mai", revenue: 412000 },
  { month: "Jun", revenue: 456890 },
];

const chartConfig = {
  revenue: { label: "Receita", color: "hsl(var(--primary))" },
  conversions: { label: "Conversões", color: "hsl(var(--primary))" },
};

export default function PerformanceOverview() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Performance de Produtos</h1>
            <p className="text-muted-foreground mt-1">
              Análise de conversão e receita por oferta e canal
            </p>
          </div>
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                      <div className="flex items-center gap-1">
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-emerald-500' : 'text-destructive'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Winning Offer */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Oferta Vencedora do Período</p>
                <p className="text-xl font-bold text-foreground">Setup Premium + 3 meses</p>
                <div className="flex items-center gap-4 mt-1">
                  <Badge className="bg-emerald-500/10 text-emerald-500">45.1% conversão</Badge>
                  <span className="text-sm text-muted-foreground">89 vendas • R$ 177.110 receita</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Evolução de Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Revenue by Channel */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Receita por Canal</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelRevenue} layout="vertical">
                    <XAxis type="number" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="channel" type="category" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Offer Performance Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Performance por Oferta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offerPerformance.map((offer, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-foreground truncate">
                    {offer.name}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(offer.revenue / 400000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="w-20 text-right">
                      <span className="font-medium text-foreground">{offer.conversions}</span>
                      <span className="text-muted-foreground ml-1">vendas</span>
                    </div>
                    <div className="w-24 text-right font-medium text-foreground">
                      R$ {(offer.revenue / 1000).toFixed(0)}k
                    </div>
                    <Badge variant="outline" className="w-16 justify-center">
                      {offer.conversion}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
