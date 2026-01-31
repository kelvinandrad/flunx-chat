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
  CreditCard, 
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Bot,
  Send,
  DollarSign
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const processes = [
  {
    id: "1",
    person: "Maria Santos",
    company: "Tech Solutions",
    product: "Consultoria Premium",
    amount: "R$ 4.500",
    dueDate: "2024-01-25",
    status: "pending",
    aiAgent: "Assistente Comercial",
  },
  {
    id: "2",
    person: "Lucas Ferreira",
    company: null,
    product: "Mentoria Individual",
    amount: "R$ 1.200",
    dueDate: "2024-01-20",
    status: "overdue",
    aiAgent: "Assistente Financeiro",
  },
  {
    id: "3",
    person: "Carla Souza",
    company: "Design Co",
    product: "Pacote Essencial",
    amount: "R$ 2.800",
    dueDate: "2024-01-28",
    status: "pending",
    aiAgent: null,
  },
];

const getStatusBadge = (status: string, dueDate: string) => {
  const isOverdue = new Date(dueDate) < new Date();
  if (status === "overdue" || isOverdue) {
    return <Badge variant="destructive">Vencido</Badge>;
  }
  return <Badge variant="outline">Pendente</Badge>;
};

export default function AwaitingPayment() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Aguardando Pagamento</h1>
          <p className="text-muted-foreground">
            Processos com cobranças pendentes
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
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl font-bold">8</p>
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
                  <p className="text-sm text-muted-foreground">Vencidos</p>
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
                  <p className="text-xl font-bold">R$ 45.200</p>
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
                  <TableHead>Pessoa / Empresa</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IA Responsável</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{process.person}</p>
                        {process.company && (
                          <p className="text-sm text-muted-foreground">{process.company}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{process.product}</TableCell>
                    <TableCell className="font-medium">{process.amount}</TableCell>
                    <TableCell>
                      {new Date(process.dueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(process.status, process.dueDate)}
                    </TableCell>
                    <TableCell>
                      {process.aiAgent ? (
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <span className="text-sm">{process.aiAgent}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
                            <Send className="h-4 w-4 mr-2" />
                            Reenviar Cobrança
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Gerar Link
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
