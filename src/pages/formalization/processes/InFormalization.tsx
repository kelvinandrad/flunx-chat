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
  Send, 
  FileText, 
  Clock,
  MoreHorizontal,
  Bot
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
    person: "João Silva",
    company: "Startup ABC",
    product: "Pacote Essencial",
    documentsStatus: "Aguardando envio",
    pendingDays: 3,
    aiAgent: null,
    nextStep: "Enviar contrato para assinatura",
  },
  {
    id: "2",
    person: "Paula Rodrigues",
    company: "Marketing Pro",
    product: "Consultoria Premium",
    documentsStatus: "Enviado, aguardando assinatura",
    pendingDays: 1,
    aiAgent: "Assistente Comercial",
    nextStep: "Aguardar assinatura do cliente",
  },
  {
    id: "3",
    person: "Ricardo Alves",
    company: null,
    product: "Mentoria Individual",
    documentsStatus: "Parcialmente assinado",
    pendingDays: 5,
    aiAgent: "Assistente Administrativo",
    nextStep: "Lembrar cliente sobre assinatura",
  },
];

export default function InFormalization() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Em Formalização</h1>
          <p className="text-muted-foreground">
            Processos aguardando assinatura de documentos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aguardando Envio</p>
                  <p className="text-xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Send className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aguardando Assinatura</p>
                  <p className="text-xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Clock className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{">"} 5 dias pendentes</p>
                  <p className="text-xl font-bold">2</p>
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
                  <TableHead>Status dos Documentos</TableHead>
                  <TableHead>Dias Pendentes</TableHead>
                  <TableHead>IA Responsável</TableHead>
                  <TableHead>Próximo Passo</TableHead>
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
                    <TableCell>
                      <Badge variant="outline">{process.documentsStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={process.pendingDays > 3 ? "text-destructive font-medium" : ""}>
                        {process.pendingDays} dias
                      </span>
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
                      <span className="text-sm">{process.nextStep}</span>
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
                            Enviar Documento
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
