import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreatePerson, useUpdatePerson, type Person } from "@/hooks/usePeople";
import { useToast } from "@/hooks/use-toast";

interface PersonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person?: Person | null;
}

const statusOptions = ["Ativo", "Pendente", "Inativo"];
const originOptions = ["Google Ads", "Facebook Ads", "LinkedIn", "Indicação", "Orgânico", "WhatsApp", "Webchat", "Manual"];

export function PersonFormDialog({ open, onOpenChange, person }: PersonFormDialogProps) {
  const { toast } = useToast();
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const isEditing = !!person;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    document: "",
    company: "",
    status: "Ativo",
    origin: "",
    tags: "",
  });

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || "",
        email: person.email || "",
        phone: person.phone || "",
        whatsapp: person.whatsapp || "",
        document: person.document || "",
        company: person.company || "",
        status: person.status || "Ativo",
        origin: person.origin || "",
        tags: Array.isArray(person.tags) ? (person.tags as string[]).join(", ") : "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        document: "",
        company: "",
        status: "Ativo",
        origin: "",
        tags: "",
      });
    }
  }, [person, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      whatsapp: formData.whatsapp || null,
      document: formData.document || null,
      company: formData.company || null,
      status: formData.status || null,
      origin: formData.origin || null,
      tags: tagsArray,
    };

    try {
      if (isEditing && person) {
        await updatePerson.mutateAsync({ id: person.id, ...payload });
        toast({
          title: "Pessoa atualizada",
          description: `${formData.name} foi atualizado(a) com sucesso.`,
        });
      } else {
        await createPerson.mutateAsync(payload);
        toast({
          title: "Pessoa criada",
          description: `${formData.name} foi adicionado(a) com sucesso.`,
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const isLoading = createPerson.isPending || updatePerson.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Pessoa" : "Criar Pessoa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+55 11 99999-9999"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+55 11 99999-9999"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  placeholder="000.000.000-00"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nome da empresa"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) => setFormData({ ...formData, origin: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    {originOptions.map((origin) => (
                      <SelectItem key={origin} value={origin}>
                        {origin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Premium, B2B, Enterprise (separadas por vírgula)"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Separe as tags por vírgula</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Criar Pessoa"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
