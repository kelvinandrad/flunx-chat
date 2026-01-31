import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  MessageCircle, 
  Save,
  Clock,
  Shield,
  Layers,
  Settings,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const channelInfo: Record<string, { name: string; icon: typeof MessageCircle; color: string }> = {
  whatsapp: { name: 'WhatsApp Business', icon: MessageCircle, color: 'emerald' },
  instagram: { name: 'Instagram Direct', icon: MessageCircle, color: 'pink' },
  webchat: { name: 'Webchat', icon: MessageCircle, color: 'blue' },
  email: { name: 'Email', icon: MessageCircle, color: 'amber' },
};

export default function ChannelConfig() {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const channel = channelInfo[channelId || 'whatsapp'];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/comunicacao/canais')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{channel?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
                <span className="text-sm text-muted-foreground">desde 15/01/2024</span>
              </div>
            </div>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Identification */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                Identificação
              </CardTitle>
              <CardDescription>Informações básicas do canal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome de exibição</Label>
                <Input defaultValue={channel?.name} />
              </div>
              <div className="space-y-2">
                <Label>Número / Identificador</Label>
                <Input defaultValue="+55 11 99999-9999" disabled />
                <p className="text-xs text-muted-foreground">Gerenciado pela integração</p>
              </div>
              <div className="space-y-2">
                <Label>Conta vinculada</Label>
                <Input defaultValue="Empresa XYZ LTDA" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Service Window */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Janela de Atendimento
              </CardTitle>
              <CardDescription>Horários de funcionamento do canal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Atendimento 24/7</p>
                  <p className="text-xs text-muted-foreground">Responder a qualquer hora</p>
                </div>
                <Switch />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Select defaultValue="08:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${String(i).padStart(2, '0')}:00`}>
                          {String(i).padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fim</Label>
                  <Select defaultValue="18:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${String(i).padStart(2, '0')}:00`}>
                          {String(i).padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mensagem fora do horário</Label>
                <Input placeholder="Nosso horário de atendimento é das 08h às 18h..." />
              </div>
            </CardContent>
          </Card>

          {/* Anti-Spam Policy */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Política Anti-Spam
              </CardTitle>
              <CardDescription>Controle de volume e frequência de mensagens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Limite diário de mensagens</Label>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={1000} className="w-32" />
                  <span className="text-sm text-muted-foreground">mensagens/dia</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Intervalo mínimo entre mensagens</Label>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={3} className="w-32" />
                  <span className="text-sm text-muted-foreground">segundos</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Detectar spam</p>
                  <p className="text-xs text-muted-foreground">Bloquear mensagens repetitivas</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Message Buffer */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                Buffer de Mensagens
              </CardTitle>
              <CardDescription>Agrupamento de mensagens recebidas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Agrupar mensagens</p>
                  <p className="text-xs text-muted-foreground">Aguardar antes de processar</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tempo de espera</Label>
                  <span className="text-sm font-medium text-foreground">5 segundos</span>
                </div>
                <Slider defaultValue={[5]} max={30} step={1} />
                <p className="text-xs text-muted-foreground">
                  Aguarda novas mensagens antes de enviar ao agente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Response Fragmentation */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Fragmentação de Resposta</CardTitle>
              <CardDescription>Como dividir respostas longas em múltiplas mensagens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">Fragmentar respostas</p>
                    <p className="text-xs text-muted-foreground">Dividir mensagens longas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Tamanho máximo por fragmento</Label>
                  <div className="flex items-center gap-3">
                    <Input type="number" defaultValue={500} className="w-32" />
                    <span className="text-sm text-muted-foreground">caracteres</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Intervalo entre fragmentos</Label>
                  <div className="flex items-center gap-3">
                    <Input type="number" defaultValue={2} className="w-32" />
                    <span className="text-sm text-muted-foreground">segundos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">Simular digitação</p>
                    <p className="text-xs text-muted-foreground">Mostrar "digitando..." antes de enviar</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
