import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Save,
  Package,
  Tag,
  Truck,
  Shield,
  Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";

export default function ProductEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'novo';
  
  const { data: existingProduct, isLoading: loadingProduct } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    sku: "",
    type: "",
    billing_model: "",
    delivery_type: "",
    delivery_duration_value: 0,
    delivery_duration_unit: "imediato",
    status: "active",
    can_upsell: true,
    can_downsell: true,
    can_standalone: true,
    can_bundle: true,
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        category: existingProduct.category || "",
        sku: existingProduct.sku || "",
        type: existingProduct.type || "",
        billing_model: existingProduct.billing_model || "",
        delivery_type: existingProduct.delivery_type || "",
        delivery_duration_value: existingProduct.delivery_duration_value || 0,
        delivery_duration_unit: existingProduct.delivery_duration_unit || "imediato",
        status: existingProduct.status || "active",
        can_upsell: existingProduct.can_upsell ?? true,
        can_downsell: existingProduct.can_downsell ?? true,
        can_standalone: existingProduct.can_standalone ?? true,
        can_bundle: existingProduct.can_bundle ?? true,
      });
    }
  }, [existingProduct]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (isNew) {
      await createProduct.mutateAsync(formData);
    } else {
      await updateProduct.mutateAsync({ id: id!, ...formData });
    }
    navigate('/produtos/catalogo/produtos');
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  if (!isNew && loadingProduct) {
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/produtos/catalogo/produtos')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {isNew ? 'Criar Produto' : 'Editar Produto'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Defina as características do produto sem incluir preço
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/produtos/catalogo/produtos')}>
              Cancelar
            </Button>
            <Button className="gap-2" onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Produto
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Identity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                Identidade do Produto
              </CardTitle>
              <CardDescription>Informações básicas de identificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Produto *</Label>
                <Input 
                  placeholder="Ex: Plataforma SaaS Enterprise" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea 
                  placeholder="Descreva o produto..."
                  className="min-h-[80px]"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="integracoes">Integrações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>SKU Interno</Label>
                  <Input 
                    placeholder="Ex: SAAS-ENT-001" 
                    className="font-mono" 
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commercial Nature */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                Natureza Comercial
              </CardTitle>
              <CardDescription>Como o produto é comercializado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Produto</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="assinatura">Assinatura</SelectItem>
                    <SelectItem value="servico">Serviço</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="setup">Setup</SelectItem>
                    <SelectItem value="fisico">Físico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Modelo de Cobrança</Label>
                <Select 
                  value={formData.billing_model} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, billing_model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="one-time">One-time (Único)</SelectItem>
                    <SelectItem value="recorrente">Recorrente</SelectItem>
                    <SelectItem value="hibrido">Híbrido (Setup + Recorrência)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Produto Ativo</p>
                  <p className="text-xs text-muted-foreground">Disponível para ofertas</p>
                </div>
                <Switch 
                  checked={formData.status === 'active'} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                Forma de Entrega
              </CardTitle>
              <CardDescription>Como o produto é entregue ao cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Entrega</Label>
                <Select 
                  value={formData.delivery_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, delivery_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="digital">Digital (Acesso imediato)</SelectItem>
                    <SelectItem value="humano">Humano (Prestação de serviço)</SelectItem>
                    <SelectItem value="automatico">Automático (Provisionamento)</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tempo Estimado de Entrega</Label>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    value={formData.delivery_duration_value} 
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_duration_value: parseInt(e.target.value) || 0 }))}
                    className="w-24" 
                  />
                  <Select 
                    value={formData.delivery_duration_unit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, delivery_duration_unit: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="imediato">Imediato</SelectItem>
                      <SelectItem value="horas">Horas</SelectItem>
                      <SelectItem value="dias">Dias</SelectItem>
                      <SelectItem value="semanas">Semanas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restrictions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Restrições Comerciais
              </CardTitle>
              <CardDescription>Regras de venda e comportamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Checkbox 
                    id="upsell" 
                    checked={formData.can_upsell}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, can_upsell: !!checked }))}
                  />
                  <div>
                    <Label htmlFor="upsell" className="cursor-pointer font-medium">
                      Pode ser usado como Upsell
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Permitir ofertar como upgrade de outro produto
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Checkbox 
                    id="downsell" 
                    checked={formData.can_downsell}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, can_downsell: !!checked }))}
                  />
                  <div>
                    <Label htmlFor="downsell" className="cursor-pointer font-medium">
                      Pode ser usado como Downsell
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Permitir ofertar como alternativa mais barata
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Checkbox 
                    id="standalone" 
                    checked={formData.can_standalone}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, can_standalone: !!checked }))}
                  />
                  <div>
                    <Label htmlFor="standalone" className="cursor-pointer font-medium">
                      Pode ser vendido isoladamente
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Sem necessidade de outro produto
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Checkbox 
                    id="bundle" 
                    checked={formData.can_bundle}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, can_bundle: !!checked }))}
                  />
                  <div>
                    <Label htmlFor="bundle" className="cursor-pointer font-medium">
                      Pode fazer parte de Bundle
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Incluir em pacotes combinados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note */}
        <Card className="bg-muted/30 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Próximo passo: Criar Ofertas</p>
                <p className="text-sm text-muted-foreground">
                  Após salvar o produto, você poderá criar ofertas com preços, condições e copy de venda em Ofertas → Ofertas Ativas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
