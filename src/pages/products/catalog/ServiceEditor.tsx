import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save,
  Briefcase,
  Clock,
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
import { useService, useCreateService, useUpdateService } from "@/hooks/useServices";

export default function ServiceEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'novo';
  
  const { data: existingService, isLoading: loadingService } = useService(id);
  const createService = useCreateService();
  const updateService = useUpdateService();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    delivery: "",
    status: "active",
  });

  useEffect(() => {
    if (existingService) {
      setFormData({
        name: existingService.name || "",
        description: existingService.description || "",
        category: existingService.category || "",
        duration: existingService.duration || "",
        delivery: existingService.delivery || "",
        status: existingService.status || "active",
      });
    }
  }, [existingService]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (isNew) {
      await createService.mutateAsync(formData);
    } else {
      await updateService.mutateAsync({ id: id!, ...formData });
    }
    navigate('/produtos/catalogo/servicos');
  };

  const isSubmitting = createService.isPending || updateService.isPending;

  if (!isNew && loadingService) {
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/produtos/catalogo/servicos')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {isNew ? 'Criar Serviço' : 'Editar Serviço'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Defina as características do serviço
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/produtos/catalogo/servicos')}>
              Cancelar
            </Button>
            <Button className="gap-2" onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Serviço
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Identity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                Identidade do Serviço
              </CardTitle>
              <CardDescription>Informações básicas de identificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Serviço *</Label>
                <Input 
                  placeholder="Ex: Consultoria de Implementação" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea 
                  placeholder="Descreva o serviço..."
                  className="min-h-[80px]"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
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
                    <SelectItem value="consultoria">Consultoria</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Duração e Entrega
              </CardTitle>
              <CardDescription>Como o serviço é prestado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Duração</Label>
                <Input 
                  placeholder="Ex: 40 horas, Mensal" 
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Forma de Entrega</Label>
                <Select 
                  value={formData.delivery} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, delivery: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="humano">Humano (Presencial/Remoto)</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Serviço Ativo</p>
                  <p className="text-xs text-muted-foreground">Disponível para ofertas</p>
                </div>
                <Switch 
                  checked={formData.status === 'active'} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
