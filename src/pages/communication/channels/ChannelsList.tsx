import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Instagram, 
  Mail, 
  Globe,
  Plus,
  Settings,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const channels = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: MessageCircle,
    status: 'connected',
    color: 'emerald',
    metrics: {
      conversations: 1234,
      responseTime: '2.3s',
      sla: 98,
    },
    lastActivity: '2 min atrás',
    limits: '1000 msg/dia'
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    icon: Instagram,
    status: 'connected',
    color: 'pink',
    metrics: {
      conversations: 567,
      responseTime: '4.1s',
      sla: 94,
    },
    lastActivity: '15 min atrás',
    limits: '500 msg/dia'
  },
  {
    id: 'webchat',
    name: 'Webchat',
    icon: Globe,
    status: 'connected',
    color: 'blue',
    metrics: {
      conversations: 890,
      responseTime: '1.8s',
      sla: 99,
    },
    lastActivity: '1 min atrás',
    limits: 'Ilimitado'
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    status: 'warning',
    color: 'amber',
    metrics: {
      conversations: 234,
      responseTime: '15min',
      sla: 87,
    },
    lastActivity: '1 hora atrás',
    limits: '500 emails/dia'
  },
];

export default function ChannelsList() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Conectado
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Atenção
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Desconectado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string }> = {
      emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500' },
      pink: { bg: 'bg-pink-500/10', icon: 'text-pink-500' },
      blue: { bg: 'bg-blue-500/10', icon: 'text-blue-500' },
      amber: { bg: 'bg-amber-500/10', icon: 'text-amber-500' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Canais de Comunicação</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas conexões e monitore a performance de cada canal
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Conectar Canal
          </Button>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const colorClasses = getColorClasses(channel.color);
            
            return (
              <Card 
                key={channel.id} 
                className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/comunicacao/canais/${channel.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-2xl ${colorClasses.bg} flex items-center justify-center`}>
                        <Icon className={`h-7 w-7 ${colorClasses.icon}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{channel.name}</h3>
                        <div className="mt-1">
                          {getStatusBadge(channel.status)}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/comunicacao/canais/${channel.id}`);
                    }}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-foreground">{channel.metrics.conversations.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">conversas</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-foreground">{channel.metrics.responseTime}</p>
                      <p className="text-xs text-muted-foreground mt-1">tempo resposta</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-foreground">{channel.metrics.sla}%</p>
                      <p className="text-xs text-muted-foreground mt-1">SLA</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      <span>{channel.lastActivity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{channel.limits}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
