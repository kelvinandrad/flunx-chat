import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  Settings,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  usePaymentMethods, 
  useCreatePaymentMethod, 
  useUpdatePaymentMethod,
  useInstallmentRules,
  useCreateInstallmentRule,
  useUpdateInstallmentRule,
  type PaymentMethod
} from "@/hooks/usePaymentConditions";
import { useTenant } from "@/contexts/TenantContext";

const defaultPaymentMethods = [
  { code: "credit_card", name: "Cartão de Crédito", icon: CreditCard, max_installments: 12, fee_description: "2.99%" },
  { code: "boleto", name: "Boleto Bancário", icon: Receipt, max_installments: 1, fee_description: "R$ 3,49" },
  { code: "pix", name: "PIX", icon: QrCode, max_installments: 1, fee_description: "0.99%" },
  { code: "transfer", name: "Transferência", icon: Banknote, max_installments: 1, fee_description: "Sem taxa" },
];

const getIconForCode = (code: string) => {
  switch (code) {
    case "credit_card": return CreditCard;
    case "boleto": return Receipt;
    case "pix": return QrCode;
    case "transfer": return Banknote;
    default: return CreditCard;
  }
};

export default function PaymentConditions() {
  const { organizationId } = useTenant();
  const { data: paymentMethods = [], isLoading: loadingMethods } = usePaymentMethods();
  const { data: installmentRules = [], isLoading: loadingRules } = useInstallmentRules();
  const createPaymentMethod = useCreatePaymentMethod();
  const updatePaymentMethod = useUpdatePaymentMethod();
  const createInstallmentRule = useCreateInstallmentRule();
  const updateInstallmentRule = useUpdateInstallmentRule();

  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
  const [methodForm, setMethodForm] = useState({
    code: "",
    name: "",
    max_installments: 1,
    fee_description: "",
    enabled: true,
  });

  // Initialize default payment methods if none exist
  useEffect(() => {
    if (!loadingMethods && paymentMethods.length === 0 && organizationId) {
      defaultPaymentMethods.forEach(method => {
        createPaymentMethod.mutate({
          code: method.code,
          name: method.name,
          max_installments: method.max_installments,
          fee_description: method.fee_description,
          enabled: method.code !== "transfer",
        });
      });
    }
  }, [loadingMethods, paymentMethods.length, organizationId]);

  // Initialize default installment rules if none exist
  useEffect(() => {
    if (!loadingRules && installmentRules.length === 0 && organizationId) {
      const defaultRules = [
        { installments_count: 1, discount_percent: 5, min_value: 0 },
        { installments_count: 2, discount_percent: 0, min_value: 200 },
        { installments_count: 3, discount_percent: 0, min_value: 300 },
        { installments_count: 6, discount_percent: 0, min_value: 500 },
        { installments_count: 12, discount_percent: 0, min_value: 1000 },
      ];
      defaultRules.forEach(rule => {
        createInstallmentRule.mutate(rule);
      });
    }
  }, [loadingRules, installmentRules.length, organizationId]);

  const handleToggleMethod = (method: PaymentMethod) => {
    updatePaymentMethod.mutate({ id: method.id, enabled: !method.enabled });
  };

  const handleToggleRule = (rule: { id: string; enabled: boolean | null }) => {
    updateInstallmentRule.mutate({ id: rule.id, enabled: !rule.enabled });
  };

  const handleAddMethod = async () => {
    if (!methodForm.name.trim() || !methodForm.code.trim()) return;
    await createPaymentMethod.mutateAsync(methodForm);
    setIsMethodDialogOpen(false);
    setMethodForm({ code: "", name: "", max_installments: 1, fee_description: "", enabled: true });
  };

  const isLoading = loadingMethods || loadingRules;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Condições de Pagamento</h1>
            <p className="text-muted-foreground mt-1">
              Configure métodos, parcelamento e regras por canal
            </p>
          </div>
          <Dialog open={isMethodDialogOpen} onOpenChange={setIsMethodDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Método
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
                <DialogDescription>Configure um novo método de pagamento</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input 
                    placeholder="Ex: credit_card"
                    value={methodForm.code}
                    onChange={(e) => setMethodForm(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input 
                    placeholder="Ex: Cartão de Crédito"
                    value={methodForm.name}
                    onChange={(e) => setMethodForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Máximo de Parcelas</Label>
                    <Input 
                      type="number"
                      value={methodForm.max_installments}
                      onChange={(e) => setMethodForm(prev => ({ ...prev, max_installments: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Taxa</Label>
                    <Input 
                      placeholder="Ex: 2.99%"
                      value={methodForm.fee_description}
                      onChange={(e) => setMethodForm(prev => ({ ...prev, fee_description: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsMethodDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddMethod} disabled={createPaymentMethod.isPending}>
                    {createPaymentMethod.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payment Methods */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
            <CardDescription>Formas de pagamento aceitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const Icon = getIconForCode(method.code);
                return (
                  <div 
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      method.enabled ? 'border-border' : 'border-border/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{method.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {method.max_installments === 1 ? 'À vista' : `Até ${method.max_installments}x`}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Taxa: {method.fee_description || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Switch 
                        checked={method.enabled ?? false} 
                        onCheckedChange={() => handleToggleMethod(method)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Installment Rules */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Regras de Parcelamento</CardTitle>
            <CardDescription>Configuração de parcelas e descontos à vista</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Parcelas</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Desconto</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Valor Mínimo</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {installmentRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">
                          {rule.installments_count === 1 ? 'À vista' : `${rule.installments_count}x`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {Number(rule.discount_percent) > 0 ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">{rule.discount_percent}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        R$ {Number(rule.min_value || 0).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Switch 
                          checked={rule.enabled ?? true}
                          onCheckedChange={() => handleToggleRule(rule)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Entry + Balance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Entrada + Saldo</CardTitle>
            <CardDescription>Configuração de pagamentos divididos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-medium text-foreground">Permitir entrada + saldo</p>
                <p className="text-xs text-muted-foreground">Dividir pagamento em partes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entrada mínima</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={30} className="w-24" />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prazo máximo para saldo</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={30} className="w-24" />
                  <span className="text-sm text-muted-foreground">dias</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
