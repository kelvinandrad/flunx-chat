import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Link,
  Target,
  Megaphone,
  ChevronRight,
  Clock
} from "lucide-react";

const standardEvents = [
  { name: "Primeira visita", tracked: true },
  { name: "Conversa iniciada", tracked: true },
  { name: "Lead criado", tracked: true },
  { name: "Etapa do funil alterada", tracked: true },
  { name: "Reunião agendada", tracked: true },
  { name: "Contrato enviado", tracked: true },
  { name: "Contrato assinado", tracked: true },
  { name: "Pagamento confirmado", tracked: true },
];

const attributionModels = [
  { name: "First Touch", description: "100% do crédito para o primeiro contato" },
  { name: "Last Touch", description: "100% do crédito para o último contato" },
  { name: "Linear", description: "Crédito distribuído igualmente" },
  { name: "Time Decay", description: "Mais crédito para contatos recentes" },
  { name: "Position-based", description: "40% primeiro, 40% último, 20% meio" },
];

export default function TrackingSettings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Traqueamento & Atribuição</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configurações de Traqueamento & Atribuição</h1>
          <p className="text-muted-foreground mt-1">
            Regras globais para tracking, UTMs e modelos de atribuição.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* UTM Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link className="h-5 w-5 text-primary" />
                Padrão de UTMs
              </CardTitle>
              <CardDescription>
                Estrutura padrão para parâmetros UTM.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Prefixo de Fonte (utm_source)</Label>
                <Input defaultValue="nexus_" placeholder="Ex: empresa_" />
              </div>

              <div className="space-y-2">
                <Label>Formato de Campanha (utm_campaign)</Label>
                <Select defaultValue="date-name">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-name">YYYY-MM_nome-campanha</SelectItem>
                    <SelectItem value="name-date">nome-campanha_YYYY-MM</SelectItem>
                    <SelectItem value="name-only">nome-campanha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2 border-t pt-4">
                <div className="space-y-0.5">
                  <Label>Forçar lowercase</Label>
                  <p className="text-sm text-muted-foreground">
                    Converter todos os UTMs para minúsculas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Remover caracteres especiais</Label>
                  <p className="text-sm text-muted-foreground">
                    Substituir espaços por hífen
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Conversion Window */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Janela de Conversão
              </CardTitle>
              <CardDescription>
                Período considerado para atribuição.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Janela de Atribuição</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Janela de Click-through</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="28">28 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Janela de View-through</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Attribution Models */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Modelos de Atribuição
              </CardTitle>
              <CardDescription>
                Modelos disponíveis para análise de conversão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <Label>Modelo Padrão</Label>
                <Select defaultValue="position-based">
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {attributionModels.map((model) => (
                      <SelectItem key={model.name} value={model.name.toLowerCase().replace(" ", "-")}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {attributionModels.map((model) => (
                  <div 
                    key={model.name}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{model.name}</h4>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trackable Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                Eventos Rastreáveis
              </CardTitle>
              <CardDescription>
                Eventos padrão capturados pelo sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {standardEvents.map((event) => (
                  <div 
                    key={event.name}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-sm">{event.name}</span>
                    <Switch checked={event.tracked} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ads Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Megaphone className="h-5 w-5 text-primary" />
                Integração com Ads
              </CardTitle>
              <CardDescription>
                Conexão com plataformas de anúncios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <span className="font-bold text-blue-500 text-sm">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google Ads</p>
                    <p className="text-sm text-muted-foreground">Campanhas de pesquisa e display</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <span className="font-bold text-blue-600 text-sm">f</span>
                  </div>
                  <div>
                    <p className="font-medium">Meta Ads</p>
                    <p className="text-sm text-muted-foreground">Facebook e Instagram</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-700/10 flex items-center justify-center">
                    <span className="font-bold text-blue-700 text-sm">in</span>
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn Ads</p>
                    <p className="text-sm text-muted-foreground">Campanhas B2B</p>
                  </div>
                </div>
                <Badge variant="outline">
                  Não conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between py-2 border-t pt-4">
                <div className="space-y-0.5">
                  <Label>Sincronizar conversões automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar eventos de conversão para plataformas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>Salvar Alterações</Button>
        </div>
      </div>
    </AppLayout>
  );
}
