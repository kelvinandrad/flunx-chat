import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const comparisonData = [
  {
    channel: "Google Ads",
    first_touch: 342,
    last_touch: 289,
    linear: 312,
    time_decay: 298,
    position_based: 318,
  },
  {
    channel: "Meta Ads",
    first_touch: 256,
    last_touch: 198,
    linear: 224,
    time_decay: 212,
    position_based: 230,
  },
  {
    channel: "Orgânico",
    first_touch: 189,
    last_touch: 156,
    linear: 172,
    time_decay: 165,
    position_based: 175,
  },
  {
    channel: "Email",
    first_touch: 67,
    last_touch: 145,
    linear: 98,
    time_decay: 118,
    position_based: 89,
  },
  {
    channel: "Direto",
    first_touch: 38,
    last_touch: 104,
    linear: 86,
    time_decay: 99,
    position_based: 80,
  },
];

const revenueData = [
  {
    channel: "Google Ads",
    first_touch: 185400,
    last_touch: 156800,
    linear: 169200,
    time_decay: 161500,
    position_based: 172800,
  },
  {
    channel: "Meta Ads",
    first_touch: 124800,
    last_touch: 96400,
    linear: 109200,
    time_decay: 103400,
    position_based: 112100,
  },
  {
    channel: "Orgânico",
    first_touch: 78500,
    last_touch: 64800,
    linear: 71400,
    time_decay: 68600,
    position_based: 72700,
  },
  {
    channel: "Email",
    first_touch: 28900,
    last_touch: 62400,
    linear: 42200,
    time_decay: 50800,
    position_based: 38300,
  },
  {
    channel: "Direto",
    first_touch: 10900,
    last_touch: 48100,
    linear: 36500,
    time_decay: 44200,
    position_based: 32600,
  },
];

const modelColors = {
  first_touch: "#4285F4",
  last_touch: "#34A853",
  linear: "#FBBC05",
  time_decay: "#EA4335",
  position_based: "#9333EA",
};

export default function ModelComparison() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Comparação de Modelos
            </h1>
            <p className="text-sm text-muted-foreground">
              Compare como cada modelo atribui conversões e receita
            </p>
          </div>

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

        {/* Conversions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Conversões Atribuídas por Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="channel"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="first_touch"
                    name="First Touch"
                    fill={modelColors.first_touch}
                  />
                  <Bar
                    dataKey="last_touch"
                    name="Last Touch"
                    fill={modelColors.last_touch}
                  />
                  <Bar
                    dataKey="linear"
                    name="Linear"
                    fill={modelColors.linear}
                  />
                  <Bar
                    dataKey="time_decay"
                    name="Time Decay"
                    fill={modelColors.time_decay}
                  />
                  <Bar
                    dataKey="position_based"
                    name="Position-based"
                    fill={modelColors.position_based}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Receita Atribuída por Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Canal
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      First Touch
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Touch
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Linear
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Time Decay
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Position-based
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {revenueData.map((row) => (
                    <tr
                      key={row.channel}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <span className="font-medium text-foreground">
                          {row.channel}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          R$ {row.first_touch.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          R$ {row.last_touch.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          R$ {row.linear.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          R$ {row.time_decay.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-foreground">
                          R$ {row.position_based.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="py-3">
                      <span className="text-foreground">Total</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-foreground">
                        R${" "}
                        {revenueData
                          .reduce((sum, r) => sum + r.first_touch, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-foreground">
                        R${" "}
                        {revenueData
                          .reduce((sum, r) => sum + r.last_touch, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-foreground">
                        R${" "}
                        {revenueData
                          .reduce((sum, r) => sum + r.linear, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-foreground">
                        R${" "}
                        {revenueData
                          .reduce((sum, r) => sum + r.time_decay, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-foreground">
                        R${" "}
                        {revenueData
                          .reduce((sum, r) => sum + r.position_based, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
