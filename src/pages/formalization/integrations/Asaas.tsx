import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  Wallet,
  Settings,
  ExternalLink,
  Zap,
  DollarSign,
  FileText
} from "lucide-react";

const chargeSettings = [
  { name: "Gerar boleto automaticamente", enabled: true },
  { name: "Enviar cobrança por email", enabled: true },
  { name: "Enviar cobrança por WhatsApp", enabled: false },
  { name: "Habilitar PIX", enabled: true },
  { name: "Permitir parcelamento", enabled: true },
];

export default function AsaasIntegration() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integração Asaas</h1>
            <p className="text-muted-foreground">
              Gerencie cobranças via Asaas
            </p>
          </div>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Asaas
          </Button>
        </div>

        {/* Connection Status */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Asaas</h3>
                  <p className="text-muted-foreground">Conta: empresa_xyz</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="gap-1 px-3 py-1">
                  <CheckCircle className="h-4 w-4" />
                  Conectado
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Configurações de Cobrança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chargeSettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{setting.name}</span>
                  <Switch checked={setting.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <p className="text-sm text-muted-foreground">Receita do Mês</p>
              </div>
              <p className="text-2xl font-bold">R$ 22.000</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Boletos Gerados</p>
              </div>
              <p className="text-2xl font-bold">34</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">PIX Recebidos</p>
              </div>
              <p className="text-2xl font-bold">18</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">96.5%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
