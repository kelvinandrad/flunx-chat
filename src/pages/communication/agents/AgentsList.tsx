import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Plus, 
  Search, 
  MoreHorizontal,
  MessageSquare,
  Play,
  Pause,
  Settings,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const agents = [
  {
    id: 1,
    name: "Vendas AI",
    type: "Especialista",
    role: "Vendas",
    channels: ["WhatsApp", "Webchat"],
    status: "active",
    conversations: 156,
    resolution: 89,
    description: "Especializado em qualificação de leads e vendas consultivas"
  },
  {
    id: 2,
    name: "Suporte AI",
    type: "Especialista",
    role: "Suporte",
    channels: ["Email", "Webchat", "WhatsApp"],
    status: "active",
    conversations: 234,
    resolution: 92,
    description: "Atendimento técnico e resolução de problemas"
  },
  {
    id: 3,
    name: "Orquestrador Principal",
    type: "Orquestrador",
    role: "Roteamento",
    channels: ["Todos"],
    status: "active",
    conversations: 890,
    resolution: 95,
    description: "Coordena a distribuição entre agentes especializados"
  },
  {
    id: 4,
    name: "Agendamento AI",
    type: "Especialista",
    role: "Agendamento",
    channels: ["WhatsApp", "Instagram"],
    status: "active",
    conversations: 78,
    resolution: 96,
    description: "Gerenciamento de agenda e marcação de reuniões"
  },
  {
    id: 5,
    name: "Cobrança AI",
    type: "Especialista",
    role: "Financeiro",
    channels: ["WhatsApp", "Email"],
    status: "paused",
    conversations: 45,
    resolution: 78,
    description: "Notificações de pagamento e renegociação"
  },
];

export default function AgentsList() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Agentes de IA</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus agentes inteligentes e suas especializações
            </p>
          </div>
          <Button onClick={() => navigate('/comunicacao/ia/agentes/novo')} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Agente
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar agentes..." className="pl-10" />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/comunicacao/ia/agentes/${agent.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      agent.type === 'Orquestrador' ? 'bg-purple-500/10' : 'bg-primary/10'
                    }`}>
                      {agent.type === 'Orquestrador' ? (
                        <Sparkles className={`h-6 w-6 ${agent.type === 'Orquestrador' ? 'text-purple-500' : 'text-primary'}`} />
                      ) : (
                        <Bot className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{agent.type}</Badge>
                        <Badge variant="secondary" className="text-xs">{agent.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {agent.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {agent.description}
                </p>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {agent.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs bg-muted/50">
                      {channel}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{agent.conversations}</p>
                      <p className="text-xs text-muted-foreground">conversas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{agent.resolution}%</p>
                      <p className="text-xs text-muted-foreground">resolução</p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      agent.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                      agent.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'
                    }`} />
                    {agent.status === 'active' ? 'Ativo' : 'Pausado'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
