import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Check,
  Star,
  Zap,
  Loader2,
  Trash2,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan, type Plan } from "@/hooks/usePlans";

export default function Plans() {
  const { data: plans = [], isLoading } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    period: "mês",
    is_popular: false,
    features: [] as string[],
    limitations: [] as string[],
    sort_order: 0,
  });
  const [newFeature, setNewFeature] = useState("");
  const [newLimitation, setNewLimitation] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      period: "mês",
      is_popular: false,
      features: [],
      limitations: [],
      sort_order: 0,
    });
    setEditingPlan(null);
    setNewFeature("");
    setNewLimitation("");
  };

  const openEditDialog = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || "",
      description: plan.description || "",
      price: plan.price?.toString() || "",
      period: plan.period || "mês",
      is_popular: plan.is_popular || false,
      features: Array.isArray(plan.features) ? plan.features as string[] : [],
      limitations: Array.isArray(plan.limitations) ? plan.limitations as string[] : [],
      sort_order: plan.sort_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      period: formData.period,
      is_popular: formData.is_popular,
      features: formData.features,
      limitations: formData.limitations,
      sort_order: formData.sort_order,
    };

    if (editingPlan) {
      await updatePlan.mutateAsync({ id: editingPlan.id, ...payload });
    } else {
      await createPlan.mutateAsync(payload);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const addLimitation = () => {
    if (newLimitation.trim()) {
      setFormData(prev => ({ ...prev, limitations: [...prev.limitations, newLimitation.trim()] }));
      setNewLimitation("");
    }
  };

  const removeLimitation = (index: number) => {
    setFormData(prev => ({ ...prev, limitations: prev.limitations.filter((_, i) => i !== index) }));
  };

  const isSubmitting = createPlan.isPending || updatePlan.isPending;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Planos & Recorrência</h1>
            <p className="text-muted-foreground mt-1">
              Configure seus planos de assinatura e opções de recorrência
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Editar Plano' : 'Criar Plano'}</DialogTitle>
                <DialogDescription>
                  Configure os detalhes do plano de assinatura
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Plano *</Label>
                    <Input 
                      placeholder="Ex: Professional"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço (R$)</Label>
                    <Input 
                      type="number"
                      placeholder="Ex: 799"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Período</Label>
                    <Input 
                      placeholder="Ex: mês, trimestre, ano"
                      value={formData.period}
                      onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordem</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea 
                    placeholder="Descreva o plano..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.is_popular}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
                  />
                  <Label>Marcar como Popular</Label>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label>Recursos Incluídos</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Adicionar recurso..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" variant="outline" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {feature}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Limitations */}
                <div className="space-y-2">
                  <Label>Limitações</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Adicionar limitação..."
                      value={newLimitation}
                      onChange={(e) => setNewLimitation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLimitation())}
                    />
                    <Button type="button" variant="outline" onClick={addLimitation}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.limitations.map((limitation, index) => (
                      <Badge key={index} variant="outline" className="gap-1 text-muted-foreground">
                        {limitation}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeLimitation(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {editingPlan ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <Card className="bg-card border-border">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Zap className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum plano encontrado</h3>
              <p className="text-muted-foreground mb-4">Comece criando seu primeiro plano</p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Plano
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const features = Array.isArray(plan.features) ? plan.features as string[] : [];
              const limitations = Array.isArray(plan.limitations) ? plan.limitations as string[] : [];
              
              return (
                <Card 
                  key={plan.id} 
                  className={`bg-card border-border relative ${plan.is_popular ? 'ring-2 ring-primary' : ''}`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground gap-1">
                        <Star className="h-3 w-3" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-foreground">
                        R$ {plan.price?.toLocaleString('pt-BR', { minimumFractionDigits: 0 }) || '0'}
                      </span>
                      <span className="text-muted-foreground">/{plan.period || 'mês'}</span>
                    </div>

                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-emerald-500" />
                          </div>
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                      {limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2 opacity-50">
                          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-muted-foreground">—</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant={plan.is_popular ? "default" : "outline"} 
                        className="flex-1"
                        onClick={() => openEditDialog(plan)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deletePlan.mutate(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Trial & Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Trial
              </CardTitle>
              <CardDescription>Período de teste gratuito</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-foreground">Trial habilitado</span>
                <Badge className="bg-emerald-500/10 text-emerald-500">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duração</span>
                <span className="font-medium text-foreground">14 dias</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plano base</span>
                <span className="font-medium text-foreground">Professional</span>
              </div>
              <Button variant="outline" className="w-full">Configurar Trial</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Setup + Recorrência</CardTitle>
              <CardDescription>Cobrança híbrida de implementação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-foreground">Setup obrigatório</span>
                <Badge variant="outline">Opcional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Valor do Setup</span>
                <span className="font-medium text-foreground">R$ 1.990</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Inclui</span>
                <span className="font-medium text-foreground">Onboarding + Treinamento</span>
              </div>
              <Button variant="outline" className="w-full">Configurar Setup</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
