import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Bell,
  User,
  Users,
  Clock,
  MessageSquare,
  Mail,
  Smartphone,
  Edit,
  Trash2
} from "lucide-react";

const reminderConfigs = [
  {
    id: 1,
    name: "Lembrete Padrão - Cliente",
    target: "client",
    channels: ["whatsapp", "email"],
    timing: ["24h", "2h"],
    active: true,
  },
  {
    id: 2,
    name: "Lembrete Padrão - Responsável",
    target: "responsible",
    channels: ["push", "email"],
    timing: ["1h", "15min"],
    active: true,
  },
  {
    id: 3,
    name: "Lembrete Duplo",
    target: "both",
    channels: ["whatsapp"],
    timing: ["24h"],
    active: false,
  },
];

const channelIcons = {
  whatsapp: MessageSquare,
  email: Mail,
  push: Smartphone,
};

const timingOptions = [
  { value: "48h", label: "48 horas antes" },
  { value: "24h", label: "24 horas antes" },
  { value: "12h", label: "12 horas antes" },
  { value: "2h", label: "2 horas antes" },
  { value: "1h", label: "1 hora antes" },
  { value: "30min", label: "30 minutos antes" },
  { value: "15min", label: "15 minutos antes" },
];

export default function Reminders() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lembretes</h1>
            <p className="text-muted-foreground">Configure lembretes para clientes, responsáveis ou ambos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Configuração
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lembretes Enviados (7d)</p>
                  <p className="text-2xl font-bold text-foreground">189</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Para Clientes</p>
                  <p className="text-2xl font-bold text-blue-500">112</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Para Responsáveis</p>
                  <p className="text-2xl font-bold text-emerald-500">77</p>
                </div>
                <Users className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurations */}
        <div className="space-y-4">
          {reminderConfigs.map((config) => (
            <Card key={config.id} className={`bg-card border-border ${!config.active ? "opacity-60" : ""}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{config.name}</h3>
                        <Badge variant={config.active ? "default" : "secondary"}>
                          {config.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      
                      {/* Target */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Para:</span>
                        {config.target === "client" && (
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <User className="h-3 w-3 mr-1" />
                            Cliente
                          </Badge>
                        )}
                        {config.target === "responsible" && (
                          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                            <Users className="h-3 w-3 mr-1" />
                            Responsável
                          </Badge>
                        )}
                        {config.target === "both" && (
                          <>
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                              <User className="h-3 w-3 mr-1" />
                              Cliente
                            </Badge>
                            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                              <Users className="h-3 w-3 mr-1" />
                              Responsável
                            </Badge>
                          </>
                        )}
                      </div>
                      
                      {/* Channels & Timing */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Canais:</span>
                          {config.channels.map((channel) => {
                            const Icon = channelIcons[channel as keyof typeof channelIcons];
                            return (
                              <Badge key={channel} variant="secondary">
                                <Icon className="h-3 w-3 mr-1" />
                                {channel === "whatsapp" ? "WhatsApp" : channel === "email" ? "Email" : "Push"}
                              </Badge>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Quando:</span>
                          {config.timing.map((time) => (
                            <Badge key={time} variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Switch checked={config.active} />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Config */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Configuração Rápida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Target */}
              <div className="space-y-3">
                <Label className="text-foreground">Enviar para</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="target-client" />
                    <Label htmlFor="target-client" className="font-normal">Cliente</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="target-responsible" />
                    <Label htmlFor="target-responsible" className="font-normal">Responsável</Label>
                  </div>
                </div>
              </div>
              
              {/* Channels */}
              <div className="space-y-3">
                <Label className="text-foreground">Canais</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="channel-whatsapp" />
                    <Label htmlFor="channel-whatsapp" className="font-normal flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> WhatsApp
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="channel-email" />
                    <Label htmlFor="channel-email" className="font-normal flex items-center gap-1">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="channel-push" />
                    <Label htmlFor="channel-push" className="font-normal flex items-center gap-1">
                      <Smartphone className="h-4 w-4" /> Push
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Timing */}
              <div className="space-y-3">
                <Label className="text-foreground">Quando enviar</Label>
                <div className="space-y-2">
                  {timingOptions.slice(0, 4).map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox id={`timing-${option.value}`} />
                      <Label htmlFor={`timing-${option.value}`} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Configuração
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
