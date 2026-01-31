import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tag, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  TrendingUp,
  Package,
  DollarSign,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOffers, useUpdateOffer } from "@/hooks/useOffers";

export default function OffersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: offers = [], isLoading } = useOffers("active");
  const updateOffer = useUpdateOffer();

  const filteredOffers = offers.filter((offer) =>
    offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.services?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string | null) => {
    const styles: Record<string, string> = {
      'Principal': 'bg-primary/10 text-primary',
      'Upsell': 'bg-emerald-500/10 text-emerald-500',
      'Downsell': 'bg-amber-500/10 text-amber-500',
      'Bundle': 'bg-purple-500/10 text-purple-500',
      'Cross-sell': 'bg-blue-500/10 text-blue-500',
    };
    return styles[type || ''] || 'bg-muted text-muted-foreground';
  };

  const handleArchive = (id: string) => {
    updateOffer.mutate({ id, status: "archived" });
  };

  const formatPrice = (price: number | null, currency: string | null, recurrence: string | null) => {
    if (!price) return "-";
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "BRL",
    }).format(price);
    if (recurrence === "monthly") return `${formatted}/mês`;
    if (recurrence === "quarterly") return `${formatted}/trim`;
    if (recurrence === "yearly") return `${formatted}/ano`;
    return formatted;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Ofertas Ativas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas ofertas comerciais com preços, copy e condições
            </p>
          </div>
          <Button onClick={() => navigate('/produtos/ofertas/nova')} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Oferta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ofertas Ativas</p>
                  <p className="text-2xl font-bold text-foreground">{offers.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversão Média</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Produtos Cobertos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(offers.map(o => o.product_id || o.service_id).filter(Boolean)).size}
                  </p>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar ofertas..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Offers Table */}
        <Card className="bg-card border-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhuma oferta encontrada</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/produtos/ofertas/nova')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira oferta
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Oferta</TableHead>
                  <TableHead>Produto/Serviço</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow 
                    key={offer.id} 
                    className="border-border cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/produtos/ofertas/${offer.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium text-foreground">{offer.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {offer.products?.name || offer.services?.name || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {formatPrice(offer.price, offer.currency, offer.recurrence)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(offer.offer_type)}>
                        {offer.offer_type || "Principal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {offer.channels || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={offer.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-amber-500/10 text-amber-500'
                        }
                      >
                        {offer.status === 'active' ? 'Ativa' : 'Pausada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => navigate(`/produtos/ofertas/${offer.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchive(offer.id)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
