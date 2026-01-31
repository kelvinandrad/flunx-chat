import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const sources = [
  {
    source: "google",
    channel: "cpc",
    sourceName: "Google",
    channelName: "Paid Search",
    people: 4820,
    leads: 1845,
    conversions: 342,
    revenue: 185400,
  },
  {
    source: "facebook",
    channel: "paid_social",
    sourceName: "Facebook",
    channelName: "Paid Social",
    people: 3650,
    leads: 1420,
    conversions: 256,
    revenue: 124800,
  },
  {
    source: "google",
    channel: "organic",
    sourceName: "Google",
    channelName: "Organic Search",
    people: 2890,
    leads: 980,
    conversions: 189,
    revenue: 78500,
  },
  {
    source: "direct",
    channel: "none",
    sourceName: "Direto",
    channelName: "Acesso Direto",
    people: 1240,
    leads: 456,
    conversions: 67,
    revenue: 28900,
  },
  {
    source: "email",
    channel: "email",
    sourceName: "Email",
    channelName: "Email Marketing",
    people: 890,
    leads: 320,
    conversions: 38,
    revenue: 10900,
  },
  {
    source: "instagram",
    channel: "paid_social",
    sourceName: "Instagram",
    channelName: "Paid Social",
    people: 1560,
    leads: 620,
    conversions: 98,
    revenue: 45600,
  },
  {
    source: "linkedin",
    channel: "paid_social",
    sourceName: "LinkedIn",
    channelName: "Paid Social",
    people: 420,
    leads: 180,
    conversions: 34,
    revenue: 28400,
  },
  {
    source: "referral",
    channel: "referral",
    sourceName: "Referral",
    channelName: "Indicações",
    people: 340,
    leads: 145,
    conversions: 28,
    revenue: 18900,
  },
];

const channelDistribution = [
  { name: "Paid Search", value: 342, color: "#4285F4" },
  { name: "Paid Social", value: 388, color: "#1877F2" },
  { name: "Organic", value: 189, color: "#34A853" },
  { name: "Email", value: 38, color: "#EA4335" },
  { name: "Direto", value: 67, color: "#FBBC05" },
  { name: "Referral", value: 28, color: "#9333EA" },
];

export default function SourcesChannels() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Fontes & Canais
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualize a origem das suas pessoas e conversões
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
          </div>
        </div>

        {/* Chart + Table Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Distribuição por Canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {channelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value} conversões`, ""]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">
                Detalhamento por Fonte
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar fonte..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Fonte
                      </th>
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Canal
                      </th>
                      <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pessoas
                      </th>
                      <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Conversões
                      </th>
                      <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Receita
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sources.map((item) => (
                      <tr
                        key={`${item.source}-${item.channel}`}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3">
                          <span className="font-medium text-foreground">
                            {item.sourceName}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-muted-foreground">
                            {item.channelName}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-foreground">
                            {item.people.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-foreground">
                            {item.leads.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-foreground">
                            {item.conversions.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-foreground">
                            R$ {item.revenue.toLocaleString()}
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
      </div>
    </AppLayout>
  );
}
