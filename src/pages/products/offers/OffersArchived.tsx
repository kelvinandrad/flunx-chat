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
  Archive, 
  Search, 
  MoreHorizontal,
  RotateCcw,
  Tag,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOffers, useUpdateOffer } from "@/hooks/useOffers";

export default function OffersArchived() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: offers = [], isLoading } = useOffers("archived");
  const updateOffer = useUpdateOffer();

  const filteredOffers = offers.filter((offer) =>
    offer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReactivate = (id: string) => {
    updateOffer.mutate({ id, status: "active" });
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
            <h1 className="text-2xl font-semibold text-foreground">Ofertas Arquivadas</h1>
            <p className="text-muted-foreground mt-1">
              Histórico de ofertas desativadas ou encerradas
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Arquivadas</p>
                  <p className="text-2xl font-bold text-foreground">{offers.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Histórica</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
                <Badge variant="outline">Lifetime</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Último Arquivamento</p>
                  <p className="text-2xl font-bold text-foreground">
                    {offers[0] ? new Date(offers[0].updated_at).toLocaleDateString("pt-BR") : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar ofertas arquivadas..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Archived Table */}
        <Card className="bg-card border-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Archive className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhuma oferta arquivada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Oferta</TableHead>
                  <TableHead>Produto/Serviço</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Arquivada em</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Tag className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-foreground">{offer.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {offer.products?.name || offer.services?.name || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(offer.price, offer.currency, offer.recurrence)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(offer.updated_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => handleReactivate(offer.id)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reativar
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
