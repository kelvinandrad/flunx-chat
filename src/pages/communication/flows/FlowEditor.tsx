import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Save,
  Play,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Zap,
  MessageSquare,
  Clock,
  GitBranch,
  Bot,
  ArrowRight,
  Plus,
  Settings,
  X
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'wait' | 'agent';
  label: string;
  x: number;
  y: number;
  config?: Record<string, unknown>;
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

const initialNodes: FlowNode[] = [
  { id: 'trigger-1', type: 'trigger', label: 'Entrada em Funil', x: 100, y: 200 },
  { id: 'wait-1', type: 'wait', label: 'Aguardar 5 min', x: 350, y: 200 },
  { id: 'action-1', type: 'action', label: 'Enviar Mensagem', x: 600, y: 200 },
  { id: 'condition-1', type: 'condition', label: 'Respondeu?', x: 850, y: 200 },
  { id: 'agent-1', type: 'agent', label: 'Chamar Vendas AI', x: 1100, y: 120 },
  { id: 'wait-2', type: 'wait', label: 'Aguardar 1 dia', x: 1100, y: 280 },
];

const initialConnections: FlowConnection[] = [
  { from: 'trigger-1', to: 'wait-1' },
  { from: 'wait-1', to: 'action-1' },
  { from: 'action-1', to: 'condition-1' },
  { from: 'condition-1', to: 'agent-1', label: 'Sim' },
  { from: 'condition-1', to: 'wait-2', label: 'Não' },
];

const nodeColors = {
  trigger: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', icon: 'text-purple-500' },
  condition: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', icon: 'text-amber-500' },
  action: { bg: 'bg-primary/10', border: 'border-primary/50', icon: 'text-primary' },
  wait: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', icon: 'text-blue-500' },
  agent: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', icon: 'text-emerald-500' },
};

const nodeIcons = {
  trigger: Zap,
  condition: GitBranch,
  action: MessageSquare,
  wait: Clock,
  agent: Bot,
};

const paletteItems = [
  { type: 'trigger', label: 'Gatilho', icon: Zap },
  { type: 'condition', label: 'Condição', icon: GitBranch },
  { type: 'action', label: 'Ação', icon: MessageSquare },
  { type: 'wait', label: 'Aguardar', icon: Clock },
  { type: 'agent', label: 'Agente', icon: Bot },
];

export default function FlowEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nodes] = useState<FlowNode[]>(initialNodes);
  const [connections] = useState<FlowConnection[]>(initialConnections);
  const [zoom, setZoom] = useState(100);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 150));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x + 80, y: node.y + 30 } : { x: 0, y: 0 };
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/comunicacao/fluxos')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <Input 
                defaultValue={id ? "Boas-vindas Lead" : "Novo Fluxo"} 
                className="font-semibold text-lg border-none bg-transparent px-0 h-auto focus-visible:ring-0"
              />
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs">Rascunho</Badge>
                <span className="text-xs text-muted-foreground">Última edição: agora</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Testar
            </Button>
            <Button size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Publicar
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Palette */}
          <div className="w-64 border-r border-border bg-card p-4 space-y-4 overflow-y-auto">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Elementos</h3>
              <div className="space-y-2">
                {paletteItems.map((item) => {
                  const Icon = item.icon;
                  const colors = nodeColors[item.type as keyof typeof nodeColors];
                  return (
                    <div
                      key={item.type}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} cursor-grab hover:opacity-80 transition-opacity`}
                      draggable
                    >
                      <Icon className={`h-4 w-4 ${colors.icon}`} />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden bg-muted/20">
            {/* Canvas Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card" onClick={() => {}}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card" onClick={() => {}}>
                <Redo className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-muted-foreground w-12 text-center">{zoom}%</span>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Grid Background */}
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Canvas */}
            <div 
              className="absolute inset-0 overflow-auto"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '1500px', minHeight: '500px' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
                  </marker>
                </defs>
                {connections.map((conn, index) => {
                  const from = getNodePosition(conn.from);
                  const to = nodes.find(n => n.id === conn.to);
                  if (!to) return null;
                  
                  const midX = (from.x + to.x) / 2;
                  
                  return (
                    <g key={index}>
                      <path
                        d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y + 30}, ${to.x} ${to.y + 30}`}
                        fill="none"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                        className="opacity-50"
                      />
                      {conn.label && (
                        <text
                          x={midX}
                          y={(from.y + to.y + 30) / 2 - 10}
                          textAnchor="middle"
                          className="text-xs fill-muted-foreground"
                        >
                          {conn.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => {
                const Icon = nodeIcons[node.type];
                const colors = nodeColors[node.type];
                const isSelected = selectedNode === node.id;
                
                return (
                  <div
                    key={node.id}
                    className={`absolute cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ left: node.x, top: node.y }}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  >
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 ${colors.border} ${colors.bg} min-w-[160px]`}>
                      <Icon className={`h-4 w-4 ${colors.icon}`} />
                      <span className="text-sm font-medium text-foreground">{node.label}</span>
                    </div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-card border-2 border-muted-foreground/30 cursor-crosshair" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Node Configuration */}
          {selectedNode && (
            <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Configuração</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedNode(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do nó</Label>
                  <Input defaultValue={nodes.find(n => n.id === selectedNode)?.label} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Badge variant="outline" className="text-xs">
                    {nodes.find(n => n.id === selectedNode)?.type}
                  </Badge>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Configure as propriedades específicas deste nó aqui. Esta é uma visualização de placeholder.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
