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

const pathNodes = [
  { id: "google", label: "Google Ads", x: 50, y: 80, volume: 2400 },
  { id: "meta", label: "Meta Ads", x: 50, y: 180, volume: 1800 },
  { id: "organic", label: "Orgânico", x: 50, y: 280, volume: 1200 },
  { id: "email", label: "Email", x: 50, y: 380, volume: 600 },
  { id: "visit", label: "Visita", x: 250, y: 180, volume: 6000 },
  { id: "lead", label: "Lead Criado", x: 450, y: 130, volume: 2800 },
  { id: "conversation", label: "Conversa IA", x: 450, y: 230, volume: 1500 },
  { id: "qualified", label: "Qualificado", x: 650, y: 180, volume: 1800 },
  { id: "proposal", label: "Proposta", x: 850, y: 130, volume: 900 },
  { id: "meeting", label: "Reunião", x: 850, y: 230, volume: 650 },
  { id: "conversion", label: "Conversão", x: 1050, y: 180, volume: 892 },
];

const pathConnections = [
  { from: "google", to: "visit", volume: 2400 },
  { from: "meta", to: "visit", volume: 1800 },
  { from: "organic", to: "visit", volume: 1200 },
  { from: "email", to: "visit", volume: 600 },
  { from: "visit", to: "lead", volume: 2800 },
  { from: "visit", to: "conversation", volume: 1500 },
  { from: "lead", to: "qualified", volume: 1200 },
  { from: "conversation", to: "qualified", volume: 600 },
  { from: "qualified", to: "proposal", volume: 900 },
  { from: "qualified", to: "meeting", volume: 650 },
  { from: "proposal", to: "conversion", volume: 520 },
  { from: "meeting", to: "conversion", volume: 372 },
];

const topPaths = [
  {
    path: ["Google Ads", "Visita", "Lead", "Qualificado", "Proposta", "Conversão"],
    volume: 342,
    percentage: 38.3,
  },
  {
    path: ["Meta Ads", "Visita", "Conversa IA", "Qualificado", "Reunião", "Conversão"],
    volume: 256,
    percentage: 28.7,
  },
  {
    path: ["Orgânico", "Visita", "Lead", "Qualificado", "Reunião", "Conversão"],
    volume: 189,
    percentage: 21.2,
  },
  {
    path: ["Email", "Visita", "Lead", "Qualificado", "Proposta", "Conversão"],
    volume: 67,
    percentage: 7.5,
  },
  {
    path: ["Google Ads", "Visita", "Conversa IA", "Qualificado", "Proposta", "Conversão"],
    volume: 38,
    percentage: 4.3,
  },
];

export default function PathAnalysis() {
  const maxVolume = Math.max(...pathConnections.map((c) => c.volume));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Análise de Caminhos
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualize os caminhos mais percorridos até a conversão
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

        {/* Flow Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Fluxo: Origem → Eventos → Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <svg width="1150" height="450" className="min-w-[1150px]">
                {/* Connections */}
                {pathConnections.map((conn, index) => {
                  const fromNode = pathNodes.find((n) => n.id === conn.from);
                  const toNode = pathNodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  const strokeWidth = Math.max(
                    2,
                    (conn.volume / maxVolume) * 20
                  );

                  return (
                    <path
                      key={index}
                      d={`M ${fromNode.x + 80} ${fromNode.y} 
                          C ${fromNode.x + 130} ${fromNode.y}, 
                            ${toNode.x - 50} ${toNode.y}, 
                            ${toNode.x} ${toNode.y}`}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth={strokeWidth}
                      strokeOpacity={0.3}
                      className="transition-all hover:stroke-opacity-60"
                    />
                  );
                })}

                {/* Nodes */}
                {pathNodes.map((node) => (
                  <g key={node.id}>
                    <rect
                      x={node.x}
                      y={node.y - 20}
                      width={160}
                      height={40}
                      rx={8}
                      fill="hsl(var(--card))"
                      stroke="hsl(var(--border))"
                      strokeWidth={1}
                      className="transition-all hover:stroke-primary"
                    />
                    <text
                      x={node.x + 80}
                      y={node.y - 2}
                      textAnchor="middle"
                      className="fill-foreground text-sm font-medium"
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x + 80}
                      y={node.y + 14}
                      textAnchor="middle"
                      className="fill-muted-foreground text-xs"
                    >
                      {node.volume.toLocaleString()}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Top Paths */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Caminhos Mais Comuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPaths.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          {item.volume} conversões
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.path.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2">
                        <Badge variant="outline">{step}</Badge>
                        {stepIndex < item.path.length - 1 && (
                          <span className="text-muted-foreground">→</span>
                        )}
                      </div>
                    ))}
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
