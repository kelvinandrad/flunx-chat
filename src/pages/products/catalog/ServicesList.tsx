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
  Briefcase, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Copy,
  Clock,
  Users,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useServices } from "@/hooks/useServices";

export default function ServicesList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: services = [], isLoading } = useServices(searchQuery);

  const activeCount = services.filter(s => s.status === 'active').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Serviços</h1>
            <p className="text-muted-foreground mt-1">
              Serviços prestados por profissionais ou de forma híbrida
            </p>
          </div>
          <Button onClick={() => navigate('/produtos/catalogo/servicos/novo')} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Serviço
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Serviços</p>
                  <p className="text-2xl font-bold text-foreground">{services.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
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
                  {services.length > 0 ? Math.round((activeCount / services.length) * 100) : 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Horas Totais</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profissionais</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar serviços..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Services Table */}
        <Card className="bg-card border-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground mb-4">Comece criando seu primeiro serviço</p>
              <Button onClick={() => navigate('/produtos/catalogo/servicos/novo')} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Serviço
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Serviço</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow 
                    key={service.id} 
                    className="border-border cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/produtos/catalogo/servicos/${service.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="font-medium text-foreground">{service.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category || '-'}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {service.duration || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted">
                        {service.delivery || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={service.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-muted text-muted-foreground'
                        }
                      >
                        {service.status === 'active' ? 'Ativo' : 'Inativo'}
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
                          <DropdownMenuItem onClick={() => navigate(`/produtos/catalogo/servicos/${service.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
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
