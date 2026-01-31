import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Bot,
  Zap,
  ArrowUpRight,
  ArrowDownRight
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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const overviewMetrics = [
  { 
    label: "Taxa de Resposta", 
    value: "94%", 
    change: "+2.3%", 
    trend: "up",
    icon: MessageSquare,
    description: "Mensagens respondidas automaticamente"
  },
  { 
    label: "Tempo Médio de Resposta", 
    value: "2.4s", 
    change: "-0.3s", 
    trend: "up",
    icon: Clock,
    description: "Tempo para primeira resposta"
  },
  { 
    label: "Taxa de Resolução", 
    value: "87%", 
    change: "+5.1%", 
    trend: "up",
    icon: CheckCircle2,
    description: "Conversas resolvidas sem escalonamento"
  },
  { 
    label: "Conversões", 
    value: "156", 
    change: "+12", 
    trend: "up",
    icon: TrendingUp,
    description: "Objetivos alcançados este mês"
  },
];

const channelData = [
  { name: "WhatsApp", conversations: 1234, resolution: 92, conversion: 23 },
  { name: "Email", conversations: 567, resolution: 78, conversion: 15 },
  { name: "Webchat", conversations: 890, resolution: 95, conversion: 28 },
  { name: "Instagram", conversations: 234, resolution: 85, conversion: 12 },
];

const agentData = [
  { name: "Vendas AI", conversations: 456, resolution: 89, conversion: 34 },
  { name: "Suporte AI", conversations: 678, resolution: 94, conversion: 8 },
  { name: "Agendamento AI", conversations: 234, resolution: 97, conversion: 45 },
  { name: "Orquestrador", conversations: 890, resolution: 95, conversion: 0 },
];

const flowData = [
  { name: "Boas-vindas", executions: 1234, conversion: 45 },
  { name: "Recuperação", executions: 567, conversion: 23 },
  { name: "Follow-up", executions: 234, conversion: 18 },
  { name: "Reativação", executions: 89, conversion: 7 },
];

const hourlyData = [
  { hour: "00h", messages: 12 },
  { hour: "02h", messages: 8 },
  { hour: "04h", messages: 5 },
  { hour: "06h", messages: 15 },
  { hour: "08h", messages: 45 },
  { hour: "10h", messages: 78 },
  { hour: "12h", messages: 65 },
  { hour: "14h", messages: 89 },
  { hour: "16h", messages: 92 },
  { hour: "18h", messages: 67 },
  { hour: "20h", messages: 45 },
  { hour: "22h", messages: 23 },
];

const pieData = [
  { name: "Resolvido AI", value: 87, color: "hsl(var(--primary))" },
  { name: "Escalado", value: 8, color: "hsl(var(--muted-foreground))" },
  { name: "Abandonado", value: 5, color: "hsl(var(--destructive))" },
];

const chartConfig = {
  conversations: { label: "Conversas", color: "hsl(var(--primary))" },
  resolution: { label: "Resolução %", color: "hsl(var(--primary))" },
  conversion: { label: "Conversão %", color: "hsl(142 76% 36%)" },
  messages: { label: "Mensagens", color: "hsl(var(--primary))" },
};

export default function Performance() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Performance</h1>
            <p className="text-muted-foreground mt-1">
              Análise de desempenho do módulo de comunicação
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

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewMetrics.map((metric) => {
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
                  <p className="text-xs text-muted-foreground mt-3">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Channel */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                Por Canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="resolution" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* By Agent */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-muted-foreground" />
                Por Agente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="resolution" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Hourly Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Distribuição por Hora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Resolution Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                Distribuição de Resoluções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <ChartContainer config={chartConfig} className="h-48 w-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">87%</p>
                      <p className="text-xs text-muted-foreground">AI</p>
                    </div>
                  </div>
                </div>
                <div className="ml-8 space-y-3">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                      <span className="text-sm font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* By Flow */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              Performance por Fluxo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flowData.map((flow) => (
                <div key={flow.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-foreground">{flow.name}</div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${flow.conversion}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground w-24">{flow.executions.toLocaleString()} exec</span>
                    <Badge variant="outline" className="w-16 justify-center">{flow.conversion}%</Badge>
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
