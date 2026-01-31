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
  CheckCircle, 
  DollarSign,
  FileText,
  Search,
  Eye
} from "lucide-react";

const processes = [
  {
    id: "1",
    person: "Ana Costa",
    company: "Corp Enterprise",
    product: "Plano Anual",
    totalRevenue: "R$ 54.000",
    documentsCount: 3,
    paymentsCount: 12,
    completedAt: "2024-01-15",
  },
  {
    id: "2",
    person: "Pedro Santos",
    company: "Startup XYZ",
    product: "Consultoria Premium",
    totalRevenue: "R$ 18.000",
    documentsCount: 2,
    paymentsCount: 4,
    completedAt: "2024-01-10",
  },
  {
    id: "3",
    person: "Mariana Lima",
    company: null,
    product: "Mentoria Individual",
    totalRevenue: "R$ 7.200",
    documentsCount: 1,
    paymentsCount: 6,
    completedAt: "2024-01-08",
  },
];

export default function CompletedProcesses() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Processos Concluídos</h1>
          <p className="text-muted-foreground">
            Histórico de processos finalizados
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
                  <p className="text-sm text-muted-foreground">Total Concluídos</p>
                  <p className="text-xl font-bold">89</p>
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
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-xl font-bold">R$ 892.400</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documentos Assinados</p>
                  <p className="text-xl font-bold">156</p>
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
                placeholder="Buscar processo concluído..."
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
                  <TableHead>Pessoa / Empresa</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Receita Total</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Pagamentos</TableHead>
                  <TableHead>Concluído em</TableHead>
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
                    <TableCell className="font-medium text-emerald-600">
                      {process.totalRevenue}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{process.documentsCount} docs</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{process.paymentsCount} pagtos</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(process.completedAt).toLocaleDateString("pt-BR")}
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
