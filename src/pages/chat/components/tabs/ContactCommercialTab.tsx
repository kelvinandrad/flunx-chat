import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  FileText,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface Proposal {
  id: string;
  title: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  totalValue: number;
  createdAt: string;
  sentAt?: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
  notes?: string;
}

interface ContactCommercialTabProps {
  proposals: Proposal[];
  products: Product[];
  onCreateProposal?: (proposal: Omit<Proposal, "id" | "createdAt">) => void;
  onSendProposal?: (proposalId: string) => void;
  onCloseProposal?: (proposalId: string, status: "accepted" | "rejected") => void;
}

// Mock products
const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Plano Básico", price: 99.90, description: "Ideal para pequenas empresas" },
  { id: "2", name: "Plano Profissional", price: 199.90, description: "Para equipes em crescimento" },
  { id: "3", name: "Plano Empresarial", price: 499.90, description: "Recursos avançados" },
  { id: "4", name: "Consultoria", price: 150.00, description: "Por hora" },
  { id: "5", name: "Treinamento", price: 500.00, description: "Sessão de 4 horas" },
];

const STATUS_CONFIG: Record<Proposal["status"], { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Rascunho", color: "bg-gray-500", icon: FileText },
  sent: { label: "Enviada", color: "bg-blue-500", icon: Send },
  viewed: { label: "Visualizada", color: "bg-purple-500", icon: Eye },
  accepted: { label: "Aceita", color: "bg-green-500", icon: CheckCircle2 },
  rejected: { label: "Recusada", color: "bg-red-500", icon: XCircle },
  expired: { label: "Expirada", color: "bg-orange-500", icon: Clock },
};

export function ContactCommercialTab({
  proposals,
  products = MOCK_PRODUCTS,
  onCreateProposal,
  onSendProposal,
  onCloseProposal,
}: ContactCommercialTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProposal, setNewProposal] = useState<{
    title: string;
    items: { productId: string; quantity: number }[];
    notes: string;
  }>({
    title: "",
    items: [],
    notes: "",
  });

  const addItem = (productId: string) => {
    const existingItem = newProposal.items.find((i) => i.productId === productId);
    if (existingItem) {
      setNewProposal({
        ...newProposal,
        items: newProposal.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      setNewProposal({
        ...newProposal,
        items: [...newProposal.items, { productId, quantity: 1 }],
      });
    }
  };

  const removeItem = (productId: string) => {
    setNewProposal({
      ...newProposal,
      items: newProposal.items.filter((i) => i.productId !== productId),
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setNewProposal({
      ...newProposal,
      items: newProposal.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    });
  };

  const calculateTotal = () => {
    return newProposal.items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCreateProposal = () => {
    const proposalItems = newProposal.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    onCreateProposal?.({
      title: newProposal.title || `Proposta ${new Date().toLocaleDateString("pt-BR")}`,
      status: "draft",
      totalValue: calculateTotal(),
      items: proposalItems,
      notes: newProposal.notes,
    });

    setNewProposal({ title: "", items: [], notes: "" });
    setIsCreating(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate stats
  const totalProposals = proposals.length;
  const acceptedValue = proposals
    .filter((p) => p.status === "accepted")
    .reduce((acc, p) => acc + p.totalValue, 0);
  const pendingValue = proposals
    .filter((p) => ["sent", "viewed"].includes(p.status))
    .reduce((acc, p) => acc + p.totalValue, 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs font-medium truncate">Fechados</span>
          </div>
          <p className="text-lg font-bold whitespace-nowrap overflow-x-auto scrollbar-thin" title={formatCurrency(acceptedValue)}>
            {formatCurrency(acceptedValue)}
          </p>
        </Card>
        <Card className="p-3 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs font-medium truncate">Em aberto</span>
          </div>
          <p className="text-lg font-bold whitespace-nowrap overflow-x-auto scrollbar-thin" title={formatCurrency(pendingValue)}>
            {formatCurrency(pendingValue)}
          </p>
        </Card>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2">
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="flex-1 gap-2">
              <Plus className="h-4 w-4" />
              Nova proposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar proposta</DialogTitle>
              <DialogDescription>
                Selecione os produtos e configure a proposta comercial
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Title */}
              <div className="space-y-2">
                <Label>Título da proposta</Label>
                <Input
                  value={newProposal.title}
                  onChange={(e) =>
                    setNewProposal({ ...newProposal, title: e.target.value })
                  }
                  placeholder="Ex: Proposta comercial - Janeiro 2026"
                />
              </div>

              {/* Products */}
              <div className="space-y-2">
                <Label>Produtos/Serviços</Label>
                <div className="space-y-2">
                  {products.map((product) => {
                    const item = newProposal.items.find(
                      (i) => i.productId === product.id
                    );
                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          item
                            ? "bg-primary/5 border-primary/20"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                        {item ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(product.id, item.quantity - 1)
                              }
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(product.id, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addItem(product.id)}
                          >
                            Adicionar
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={newProposal.notes}
                  onChange={(e) =>
                    setNewProposal({ ...newProposal, notes: e.target.value })
                  }
                  placeholder="Condições especiais, prazo de validade, etc..."
                  rows={3}
                />
              </div>

              {/* Total */}
              {newProposal.items.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateProposal}
                disabled={newProposal.items.length === 0}
              >
                Criar proposta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Proposals list */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Propostas ({totalProposals})
        </h4>

        <ScrollArea className="h-[300px] -mx-4 px-4">
          {proposals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Nenhuma proposta</p>
              <p className="text-sm mt-1">
                Crie uma proposta para iniciar uma negociação
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {proposals.map((proposal) => {
                const StatusIcon = STATUS_CONFIG[proposal.status].icon;
                return (
                  <Card key={proposal.id} className="p-3 min-w-0 overflow-hidden">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                          <p className="font-medium text-sm break-words min-w-0">
                            {proposal.title}
                          </p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs text-white whitespace-nowrap flex-shrink-0",
                              STATUS_CONFIG[proposal.status].color
                            )}
                            title={STATUS_CONFIG[proposal.status].label}
                          >
                            <StatusIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            {STATUS_CONFIG[proposal.status].label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(proposal.createdAt)} •{" "}
                          {proposal.items.length} item(s)
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1 whitespace-nowrap overflow-x-auto scrollbar-thin" title={formatCurrency(proposal.totalValue)}>
                          {formatCurrency(proposal.totalValue)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {proposal.status === "draft" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => onSendProposal?.(proposal.id)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Enviar
                          </Button>
                        )}
                        {["sent", "viewed"].includes(proposal.status) && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-xs"
                              onClick={() =>
                                onCloseProposal?.(proposal.id, "accepted")
                              }
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Fechar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() =>
                                onCloseProposal?.(proposal.id, "rejected")
                              }
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Recusar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
