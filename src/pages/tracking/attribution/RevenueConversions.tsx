import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Target, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueByChannel = [
  { channel: "Google Ads", revenue: 185400, conversions: 342, color: "#4285F4" },
  { channel: "Meta Ads", revenue: 124800, conversions: 256, color: "#1877F2" },
  { channel: "Orgânico", revenue: 78500, conversions: 189, color: "#34A853" },
  { channel: "Email", revenue: 28900, conversions: 67, color: "#EA4335" },
  { channel: "Direto", revenue: 10900, conversions: 38, color: "#FBBC05" },
];

const revenueByCampaign = [
  { campaign: "Black Friday 2024", revenue: 98400, conversions: 186 },
  { campaign: "Remarketing Carrinho", revenue: 67200, conversions: 124 },
  { campaign: "Prospecção Lookalike", revenue: 52100, conversions: 98 },
  { campaign: "Webinar Dezembro", revenue: 41800, conversions: 78 },
  { campaign: "Newsletter Mensal", revenue: 24500, conversions: 45 },
  { campaign: "LinkedIn B2B", revenue: 89500, conversions: 34 },
];

const revenueByOffer = [
  { offer: "Plano Pro Anual", revenue: 156000, conversions: 130 },
  { offer: "Plano Pro Mensal", revenue: 89100, conversions: 297 },
  { offer: "Plano Enterprise", revenue: 120000, conversions: 40 },
  { offer: "Plano Starter", revenue: 42800, conversions: 214 },
  { offer: "Add-on Premium", revenue: 20600, conversions: 103 },
];

const totalRevenue = revenueByChannel.reduce((sum, c) => sum + c.revenue, 0);
const totalConversions = revenueByChannel.reduce((sum, c) => sum + c.conversions, 0);

export default function RevenueConversions() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Receita & Conversões
            </h1>
            <p className="text-sm text-muted-foreground">
              Análise de receita atribuída por canal, campanha e oferta
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Receita Total Atribuída
                  </p>
                  <p className="text-2xl font-semibold">
                    R$ {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Conversões Totais
                  </p>
                  <p className="text-2xl font-semibold">
                    {totalConversions.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  <p className="text-2xl font-semibold">
                    R$ {Math.round(totalRevenue / totalConversions).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue by Channel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Receita por Canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByChannel}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="revenue"
                      nameKey="channel"
                    >
                      {revenueByChannel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString()}`,
                        "Receita",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {revenueByChannel.map((item) => (
                  <div key={item.channel} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.channel}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Campaign */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Receita por Campanha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByCampaign} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) => `R$ ${value / 1000}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="campaign"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      width={120}
                      tickFormatter={(value) =>
                        value.length > 15 ? `${value.slice(0, 15)}...` : value
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString()}`,
                        "Receita",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Offer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Receita por Oferta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Oferta
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Receita
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Conversões
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ticket Médio
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      % do Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {revenueByOffer.map((offer) => (
                    <tr
                      key={offer.offer}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <span className="font-medium text-foreground">
                          {offer.offer}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          R$ {offer.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          {offer.conversions}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          R${" "}
                          {Math.round(
                            offer.revenue / offer.conversions
                          ).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-muted-foreground">
                          {((offer.revenue / totalRevenue) * 100).toFixed(1)}%
                        </span>
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
