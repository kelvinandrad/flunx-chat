import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Save,
  Package,
  DollarSign,
  FileText,
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
import { useOffer, useCreateOffer, useUpdateOffer } from "@/hooks/useOffers";
import { useProducts } from "@/hooks/useProducts";
import { useServices } from "@/hooks/useServices";
import { usePlans } from "@/hooks/usePlans";

export default function OfferEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'nova' || !id;

  const { data: offer, isLoading: offerLoading } = useOffer(isNew ? undefined : id);
  const { data: products = [] } = useProducts();
  const { data: services = [] } = useServices();
  const { data: plans = [] } = usePlans();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();

  const [formData, setFormData] = useState({
    name: "",
    product_id: "",
    service_id: "",
    plan_id: "",
    offer_type: "Principal",
    price: "",
    currency: "BRL",
    recurrence: "",
    status: "active",
    headline: "",
    benefits: "",
    channels: "",
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        name: offer.name || "",
        product_id: offer.product_id || "",
        service_id: offer.service_id || "",
        plan_id: offer.plan_id || "",
        offer_type: offer.offer_type || "Principal",
        price: offer.price?.toString() || "",
        currency: offer.currency || "BRL",
        recurrence: offer.recurrence || "",
        status: offer.status || "active",
        headline: offer.headline || "",
        benefits: offer.benefits || "",
        channels: offer.channels || "",
      });
    }
  }, [offer]);

  const handleSave = () => {
    const payload = {
      name: formData.name,
      product_id: formData.product_id || null,
      service_id: formData.service_id || null,
      plan_id: formData.plan_id || null,
      offer_type: formData.offer_type,
      price: formData.price ? parseFloat(formData.price) : null,
      currency: formData.currency,
      recurrence: formData.recurrence || null,
      status: formData.status,
      headline: formData.headline || null,
      benefits: formData.benefits || null,
      channels: formData.channels || null,
    };

    if (isNew) {
      createOffer.mutate(payload, {
        onSuccess: () => navigate("/produtos/ofertas/ativas"),
      });
    } else {
      updateOffer.mutate({ id: id!, ...payload }, {
        onSuccess: () => navigate("/produtos/ofertas/ativas"),
      });
    }
  };

  if (!isNew && offerLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/produtos/ofertas/ativas')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {isNew ? 'Criar Oferta' : 'Editar Oferta'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure produto, preço e informações da oferta
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/produtos/ofertas/ativas')}>
              Cancelar
            </Button>
            <Button 
              className="gap-2" 
              onClick={handleSave}
              disabled={createOffer.isPending || updateOffer.isPending}
            >
              {(createOffer.isPending || updateOffer.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <Save className="h-4 w-4" />
              Salvar Oferta
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="product" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="product" className="gap-2">
              <Package className="h-4 w-4" />
              Produto
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Precificação
            </TabsTrigger>
            <TabsTrigger value="copy" className="gap-2">
              <FileText className="h-4 w-4" />
              Copy da Oferta
            </TabsTrigger>
          </TabsList>

          {/* Product Tab */}
          <TabsContent value="product" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Produto Vinculado</CardTitle>
                <CardDescription>Selecione o produto ou serviço base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Oferta *</Label>
                  <Input 
                    placeholder="Ex: Enterprise Anual - Black Friday"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Produto Base</Label>
                  <Select 
                    value={formData.product_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="">Nenhum</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Serviço Base</Label>
                  <Select 
                    value={formData.service_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, service_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="">Nenhum</SelectItem>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plano (opcional)</Label>
                  <Select 
                    value={formData.plan_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, plan_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="">Nenhum</SelectItem>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Oferta</Label>
                  <Select
                    value={formData.offer_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, offer_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Principal">Principal</SelectItem>
                      <SelectItem value="Upsell">Upsell</SelectItem>
                      <SelectItem value="Downsell">Downsell</SelectItem>
                      <SelectItem value="Cross-sell">Cross-sell</SelectItem>
                      <SelectItem value="Bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Canais</Label>
                  <Input 
                    placeholder="Ex: WhatsApp, Email, Vendas"
                    value={formData.channels}
                    onChange={(e) => setFormData(prev => ({ ...prev, channels: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Precificação</CardTitle>
                <CardDescription>Defina preço e recorrência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preço</Label>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={formData.currency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="BRL">R$</SelectItem>
                          <SelectItem value="USD">$</SelectItem>
                          <SelectItem value="EUR">€</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        type="number" 
                        placeholder="0,00" 
                        className="flex-1"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Recorrência</Label>
                    <Select
                      value={formData.recurrence}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, recurrence: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="one-time">Pagamento Único</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="paused">Pausada</SelectItem>
                      <SelectItem value="archived">Arquivada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Copy Tab */}
          <TabsContent value="copy" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Copy da Oferta</CardTitle>
                <CardDescription>Textos para vendas e comunicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline Principal</Label>
                  <Input 
                    placeholder="Ex: Transforme sua operação com nossa plataforma enterprise"
                    value={formData.headline}
                    onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Benefícios</Label>
                  <Textarea 
                    placeholder="• Aumente sua produtividade em 40%&#10;• Suporte 24/7 dedicado&#10;• Integração com +50 ferramentas"
                    className="min-h-[150px]"
                    value={formData.benefits}
                    onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
