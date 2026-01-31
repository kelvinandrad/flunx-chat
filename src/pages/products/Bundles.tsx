import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Package,
  Layers,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const bundles = [
  {
    id: 1,
    name: "Pacote Completo Enterprise",
    products: ["Plataforma SaaS Enterprise", "Setup Inicial", "Treinamento Avançado"],
    originalPrice: "R$ 7.380",
    bundlePrice: "R$ 5.990",
    discount: "19%",
    status: "active",
    sales: 45,
    mainOffer: "Enterprise Anual",
    fallback: "Plano Professional"
  },
  {
    id: 2,
    name: "Starter + Consultoria",
    products: ["Plataforma SaaS Starter", "Consultoria Express"],
    originalPrice: "R$ 8.490",
    bundlePrice: "R$ 6.990",
    discount: "18%",
    status: "active",
    sales: 23,
    mainOffer: "Consultoria Combo",
    fallback: "Starter Solo"
  },
  {
    id: 3,
    name: "Setup Premium",
    products: ["Setup Inicial", "Treinamento Avançado", "Suporte Dedicado 3 meses"],
    originalPrice: "R$ 12.870",
    bundlePrice: "R$ 9.900",
    discount: "23%",
    status: "draft",
    sales: 0,
    mainOffer: null,
    fallback: null
  },
];

export default function Bundles() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Bundles & Combos</h1>
            <p className="text-muted-foreground mt-1">
              Crie pacotes combinados de produtos com descontos especiais
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Bundle
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Bundles</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vendas de Bundles</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500">+23%</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita de Bundles</p>
                  <p className="text-2xl font-bold text-foreground">R$ 489k</p>
                </div>
                <span className="text-sm text-muted-foreground">Este mês</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Desconto Médio</p>
                  <p className="text-2xl font-bold text-foreground">20%</p>
                </div>
                <span className="text-sm text-muted-foreground">vs. avulso</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar bundles..." className="pl-10" />
          </div>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bundle.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={bundle.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-muted text-muted-foreground'
                          }
                        >
                          {bundle.status === 'active' ? 'Ativo' : 'Rascunho'}
                        </Badge>
                        {bundle.sales > 0 && (
                          <span className="text-xs text-muted-foreground">{bundle.sales} vendas</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Products List */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Produtos incluídos
                  </p>
                  <div className="space-y-1">
                    {bundle.products.map((product, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">{product}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm text-muted-foreground line-through">{bundle.originalPrice}</p>
                    <p className="text-lg font-bold text-foreground">{bundle.bundlePrice}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 text-lg">
                    -{bundle.discount}
                  </Badge>
                </div>

                {/* Offers */}
                {(bundle.mainOffer || bundle.fallback) && (
                  <div className="space-y-2">
                    {bundle.mainOffer && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Oferta principal:</span>
                        <span className="font-medium text-foreground">{bundle.mainOffer}</span>
                      </div>
                    )}
                    {bundle.fallback && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fallback:</span>
                        <span className="font-medium text-foreground">{bundle.fallback}</span>
                      </div>
                    )}
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  Gerenciar Bundle
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
