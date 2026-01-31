import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ZoomIn,
  ZoomOut,
  Hand,
  MousePointer,
  Plus,
  Save,
  Eye,
  Settings,
  Undo,
  Redo,
  ChevronLeft,
  Play,
  Square,
  Circle,
  Diamond,
  Hexagon,
  ArrowRight,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FunnelNode {
  id: string;
  type: "entry" | "stage" | "condition" | "conversion" | "exit";
  label: string;
  x: number;
  y: number;
  count: number;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  count: number;
}

const initialNodes: FunnelNode[] = [
  { id: "1", type: "entry", label: "Entrada", x: 100, y: 200, count: 1284, color: "bg-blue-500" },
  { id: "2", type: "stage", label: "Visita Site", x: 300, y: 200, count: 1156, color: "bg-primary" },
  { id: "3", type: "stage", label: "Cadastro", x: 500, y: 200, count: 824, color: "bg-primary" },
  { id: "4", type: "condition", label: "Qualificado?", x: 700, y: 200, count: 612, color: "bg-amber-500" },
  { id: "5", type: "stage", label: "Proposta", x: 900, y: 150, count: 445, color: "bg-primary" },
  { id: "6", type: "exit", label: "Desqualificado", x: 900, y: 300, count: 167, color: "bg-red-500" },
  { id: "7", type: "conversion", label: "Conversão", x: 1100, y: 150, count: 342, color: "bg-green-500" },
];

const initialConnections: Connection[] = [
  { from: "1", to: "2", count: 1156 },
  { from: "2", to: "3", count: 824 },
  { from: "3", to: "4", count: 612 },
  { from: "4", to: "5", count: 445 },
  { from: "4", to: "6", count: 167 },
  { from: "5", to: "7", count: 342 },
];

const nodeTypes = [
  { type: "entry", label: "Entrada", icon: Play, color: "bg-blue-500" },
  { type: "stage", label: "Etapa", icon: Square, color: "bg-primary" },
  { type: "condition", label: "Condição", icon: Diamond, color: "bg-amber-500" },
  { type: "conversion", label: "Conversão", icon: Hexagon, color: "bg-green-500" },
  { type: "exit", label: "Saída", icon: Circle, color: "bg-red-500" },
];

export default function FunnelEditor() {
  const navigate = useNavigate();
  const [nodes] = useState<FunnelNode[]>(initialNodes);
  const [connections] = useState<Connection[]>(initialConnections);
  const [zoom, setZoom] = useState(100);
  const [tool, setTool] = useState<"select" | "pan">("select");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "entry": return Play;
      case "stage": return Square;
      case "condition": return Diamond;
      case "conversion": return Hexagon;
      case "exit": return Circle;
      default: return Square;
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  const getConnectionPath = useCallback((from: FunnelNode, to: FunnelNode) => {
    const startX = from.x + 80;
    const startY = from.y + 30;
    const endX = to.x;
    const endY = to.y + 30;
    const midX = (startX + endX) / 2;
    
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  }, []);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col -m-6">
        {/* Editor Toolbar */}
        <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/funis")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-medium text-foreground">Funil de Aquisição Principal</h1>
              <p className="text-xs text-muted-foreground">Última edição há 2 horas</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
              Ativo
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button
                variant={tool === "select" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTool("select")}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === "pan" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTool("pan")}
              >
                <Hand className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-sm text-muted-foreground">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Node Palette */}
          <div className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Nós
            </p>
            {nodeTypes.map((nodeType) => {
              const Icon = nodeType.icon;
              return (
                <button
                  key={nodeType.type}
                  className="w-12 h-12 rounded-lg border border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors group"
                  title={nodeType.label}
                >
                  <div className={cn("h-6 w-6 rounded flex items-center justify-center", nodeType.color)}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[9px] text-muted-foreground group-hover:text-foreground">
                    {nodeType.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Canvas Area */}
          <div 
            className="flex-1 relative overflow-hidden"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            {/* Animated Particles (Mock) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-primary/60 animate-pulse"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${35 + Math.sin(i) * 10}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            {/* Canvas Content */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
            >
              {/* Connections */}
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <g key={`${conn.from}-${conn.to}`}>
                    <path
                      d={getConnectionPath(fromNode, toNode)}
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                      className="transition-all"
                    />
                    {/* Connection count badge */}
                    <foreignObject
                      x={(fromNode.x + 80 + toNode.x) / 2 - 20}
                      y={(fromNode.y + toNode.y) / 2 + 10}
                      width="40"
                      height="20"
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {conn.count}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            <div 
              className="absolute inset-0"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
            >
              {nodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute w-40 cursor-pointer transition-all",
                      selectedNode === node.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    style={{ left: node.x, top: node.y }}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn("h-6 w-6 rounded flex items-center justify-center", node.color)}>
                            <Icon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">
                            {node.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">
                            {node.count.toLocaleString()} pessoas
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar (Node Config) */}
          {showSidebar && selectedNode && (
            <div className="w-72 border-l border-border bg-card p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">Configuração do Nó</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedNode(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {(() => {
                const node = nodes.find((n) => n.id === selectedNode);
                if (!node) return null;
                const Icon = getNodeIcon(node.type);
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", node.color)}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{node.label}</p>
                        <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Nome do Nó</label>
                      <input
                        type="text"
                        defaultValue={node.label}
                        className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Métricas</label>
                      <div className="mt-2 p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Pessoas</span>
                          <span className="text-sm font-medium text-foreground">
                            {node.count.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Taxa de Saída</span>
                          <span className="text-sm font-medium text-foreground">12%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Tempo Médio</span>
                          <span className="text-sm font-medium text-foreground">2.4 dias</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Ações</label>
                      <div className="mt-2 space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar Automação
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Adicionar Conexão
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
