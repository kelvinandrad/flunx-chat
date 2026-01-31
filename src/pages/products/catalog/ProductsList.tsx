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
  Package, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Copy,
  Tag,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [], isLoading } = useProducts(searchQuery);

  const activeCount = products.filter(p => p.status === 'active').length;
  const recurrentCount = products.filter(p => p.billing_model === 'recorrente' || p.billing_model === 'hibrido').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Produtos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie o que existe para ser vendido, sem lógica de preço ou oferta
            </p>
          </div>
          <Button onClick={() => navigate('/produtos/catalogo/produtos/novo')} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Produto
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Produtos</p>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500">
                  {products.length > 0 ? Math.round((activeCount / products.length) * 100) : 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recorrentes</p>
                  <p className="text-2xl font-bold text-foreground">{recurrentCount}</p>
                </div>
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Com Ofertas</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar produtos..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Products Table */}
        <Card className="bg-card border-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-4">Comece criando seu primeiro produto</p>
              <Button onClick={() => navigate('/produtos/catalogo/produtos/novo')} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Produto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Recorrência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ofertas</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow 
                    key={product.id} 
                    className="border-border cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/produtos/catalogo/produtos/${product.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type || '-'}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {product.sku || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted">
                        {product.delivery_type || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.billing_model === 'recorrente' || product.billing_model === 'hibrido' ? (
                        <Badge className="bg-blue-500/10 text-blue-500">Sim</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={product.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-muted text-muted-foreground'
                        }
                      >
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">0</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => navigate(`/produtos/catalogo/produtos/${product.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="h-4 w-4 mr-2" />
                            Ver Ofertas
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
