import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  CreditCard,
  Settings,
  ExternalLink,
  Zap,
  DollarSign,
  TrendingUp
} from "lucide-react";

const paymentMethods = [
  { name: "Cartão de Crédito", enabled: true, icon: CreditCard },
  { name: "Boleto Bancário", enabled: true, icon: DollarSign },
  { name: "PIX", enabled: false, icon: Zap },
];

const webhooks = [
  { event: "payment_intent.succeeded", status: "active" },
  { event: "payment_intent.payment_failed", status: "active" },
  { event: "invoice.paid", status: "active" },
  { event: "customer.subscription.updated", status: "active" },
];

export default function StripeIntegration() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integração Stripe</h1>
            <p className="text-muted-foreground">
              Gerencie pagamentos via Stripe
            </p>
          </div>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Dashboard Stripe
          </Button>
        </div>

        {/* Connection Status */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-[#635BFF]/10 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-[#635BFF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stripe</h3>
                  <p className="text-muted-foreground">Conta: empresa_xyz@stripe.com</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Métodos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <Switch checked={method.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Status dos Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhooks.map((webhook, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <code className="text-sm font-mono">{webhook.event}</code>
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Ativo
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Receita do Mês (Stripe)</p>
              <p className="text-2xl font-bold mt-1">R$ 67.400</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Transações</p>
              <p className="text-2xl font-bold mt-1">89</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </div>
              <p className="text-2xl font-bold mt-1 text-emerald-600">98.2%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
