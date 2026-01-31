import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  CreditCard,
  MoreHorizontal,
  Link,
  Send,
  XCircle,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  pending: { label: "Pendente", variant: "outline", icon: Clock },
  paid: { label: "Pago", variant: "default", icon: CheckCircle },
  overdue: { label: "Vencido", variant: "destructive", icon: AlertTriangle },
  cancelled: { label: "Cancelado", variant: "secondary", icon: XCircle },
};

const charges = [
  {
    id: "1",
    person: "Maria Santos",
    process: "PROC-001",
    gateway: "Stripe",
    amount: "R$ 4.500",
    installments: "1/3",
    status: "paid",
    dueDate: "2024-01-15",
  },
  {
    id: "2",
    person: "Maria Santos",
    process: "PROC-001",
    gateway: "Stripe",
    amount: "R$ 4.500",
    installments: "2/3",
    status: "pending",
    dueDate: "2024-02-15",
  },
  {
    id: "3",
    person: "João Silva",
    process: "PROC-002",
    gateway: "Asaas",
    amount: "R$ 2.800",
    installments: "1/1",
    status: "pending",
    dueDate: "2024-01-25",
  },
  {
    id: "4",
    person: "Carlos Mendes",
    process: "PROC-004",
    gateway: "Stripe",
    amount: "R$ 1.200",
    installments: "3/6",
    status: "overdue",
    dueDate: "2024-01-10",
  },
  {
    id: "5",
    person: "Ana Costa",
    process: "PROC-003",
    gateway: "Asaas",
    amount: "R$ 4.500",
    installments: "12/12",
    status: "paid",
    dueDate: "2024-01-01",
  },
];

export default function AllCharges() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");

  const filteredCharges = charges.filter((charge) => {
    const matchesSearch = 
      charge.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.process.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || charge.status === statusFilter;
    const matchesGateway = gatewayFilter === "all" || charge.gateway === gatewayFilter;
    return matchesSearch && matchesStatus && matchesGateway;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Todas as Cobranças</h1>
            <p className="text-muted-foreground">
              Gerencie cobranças e pagamentos
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Cobrança
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cobrança..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os gateways</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Asaas">Asaas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Parcelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCharges.map((charge) => {
                  const StatusIcon = statusConfig[charge.status].icon;
                  return (
                    <TableRow key={charge.id}>
                      <TableCell className="font-medium">{charge.person}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{charge.process}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          {charge.gateway}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{charge.amount}</TableCell>
                      <TableCell>{charge.installments}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[charge.status].variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[charge.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(charge.dueDate).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link className="h-4 w-4 mr-2" />
                              Gerar Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Reenviar Cobrança
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Comprovante
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
