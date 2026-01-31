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
  Search,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Eye
} from "lucide-react";

const payments = [
  {
    id: "1",
    person: "Maria Santos",
    process: "PROC-001",
    amount: "R$ 4.500",
    paidAt: "2024-01-17",
    gateway: "Stripe",
    method: "Cartão de Crédito",
  },
  {
    id: "2",
    person: "Ana Costa",
    process: "PROC-003",
    amount: "R$ 4.500",
    paidAt: "2024-01-15",
    gateway: "Asaas",
    method: "PIX",
  },
  {
    id: "3",
    person: "Pedro Santos",
    process: "PROC-006",
    amount: "R$ 2.800",
    paidAt: "2024-01-14",
    gateway: "Stripe",
    method: "Boleto",
  },
  {
    id: "4",
    person: "Fernanda Lima",
    process: "PROC-005",
    amount: "R$ 3.200",
    paidAt: "2024-01-12",
    gateway: "Asaas",
    method: "PIX",
  },
];

export default function ReceivedPayments() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pagamentos Recebidos</h1>
          <p className="text-muted-foreground">
            Histórico de pagamentos confirmados
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Este Mês</p>
                  <p className="text-xl font-bold">28</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita do Mês</p>
                  <p className="text-xl font-bold">R$ 89.400</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">vs. Mês Anterior</p>
                  <p className="text-xl font-bold text-emerald-600">+12%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagamento..."
                className="pl-9"
              />
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
                  <TableHead>Valor</TableHead>
                  <TableHead>Data do Pagamento</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.person}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.process}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      {payment.amount}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.paidAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{payment.gateway}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{payment.method}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
