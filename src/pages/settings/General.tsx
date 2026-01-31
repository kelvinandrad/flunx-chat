import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Clock, 
  Calendar, 
  DollarSign, 
  Bell, 
  Beaker,
  Building2,
  ChevronRight
} from "lucide-react";

export default function General() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Geral</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configurações Gerais</h1>
          <p className="text-muted-foreground mt-1">
            Ajustes globais do tenant e preferências do sistema.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Localização & Formato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                Localização & Formato
              </CardTitle>
              <CardDescription>
                Defina idioma, fuso horário e formatos de exibição.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma Padrão</Label>
                <Select defaultValue="pt-br">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fuso Horário
                </Label>
                <Select defaultValue="america-sao-paulo">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecione o fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-sao-paulo">América/São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="america-new-york">América/New York (GMT-5)</SelectItem>
                    <SelectItem value="europe-london">Europa/London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Formato de Data/Hora
                </Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY HH:mm</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY HH:mm AM/PM</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD HH:mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Moeda Padrão
                </Label>
                <Select defaultValue="brl">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brl">BRL - Real Brasileiro (R$)</SelectItem>
                    <SelectItem value="usd">USD - Dólar Americano ($)</SelectItem>
                    <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando você recebe notificações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas importantes por e-mail
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações no navegador em tempo real
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Resumo Diário</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba um resumo diário de atividades
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sons de Notificação</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar sons para notificações
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Recursos Experimentais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Beaker className="h-5 w-5 text-primary" />
                Recursos Experimentais
              </CardTitle>
              <CardDescription>
                Teste funcionalidades em desenvolvimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label>Nova Interface de IA</Label>
                    <Badge variant="secondary" className="text-xs">Beta</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Experimente a nova interface de conversação com IA
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label>Analytics Avançado</Label>
                    <Badge variant="secondary" className="text-xs">Alpha</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dashboards com métricas experimentais
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label>Automações Avançadas</Label>
                    <Badge variant="secondary" className="text-xs">Beta</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Novos triggers e ações para automações
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Status do Tenant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Status do Tenant
              </CardTitle>
              <CardDescription>
                Informações sobre a conta e status do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Status da Conta</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Ativo
                </Badge>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Plano Atual</span>
                <span className="text-sm font-medium">Enterprise</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                <span className="text-sm font-medium">12 / 25</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">ID do Tenant</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">tenant_a1b2c3d4</code>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Criado em</span>
                <span className="text-sm">15/01/2024</span>
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
