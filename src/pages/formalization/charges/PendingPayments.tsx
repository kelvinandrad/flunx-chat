import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Link,
  Send,
  Bot,
  DollarSign
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const charges = [
  {
    id: "1",
    person: "Maria Santos",
    process: "PROC-001",
    amount: "R$ 4.500",
    dueDate: "2024-02-15",
    daysUntilDue: 20,
    gateway: "Stripe",
  },
  {
    id: "2",
    person: "João Silva",
    process: "PROC-002",
    amount: "R$ 2.800",
    dueDate: "2024-01-25",
    daysUntilDue: 5,
    gateway: "Asaas",
  },
  {
    id: "3",
    person: "Fernanda Lima",
    process: "PROC-005",
    amount: "R$ 3.200",
    dueDate: "2024-01-22",
    daysUntilDue: 2,
    gateway: "Stripe",
  },
];

export default function PendingPayments() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pagamentos Pendentes</h1>
          <p className="text-muted-foreground">
            Cobranças aguardando pagamento
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendente</p>
                  <p className="text-xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vence em 3 dias</p>
                  <p className="text-xl font-bold">3</p>
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
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold">R$ 32.500</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Dias até vencer</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell className="font-medium">{charge.person}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{charge.process}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{charge.amount}</TableCell>
                    <TableCell>
                      {new Date(charge.dueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={charge.daysUntilDue <= 3 ? "destructive" : "secondary"}
                      >
                        {charge.daysUntilDue} dias
                      </Badge>
                    </TableCell>
                    <TableCell>{charge.gateway}</TableCell>
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
                            Enviar Lembrete
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bot className="h-4 w-4 mr-2" />
                            Acionar IA
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
