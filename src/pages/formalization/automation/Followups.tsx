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
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
  MoreHorizontal,
  Play,
  Pause
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "outline" },
  in_progress: { label: "Em Andamento", variant: "default" },
  completed: { label: "Concluído", variant: "secondary" },
  failed: { label: "Falhou", variant: "destructive" },
};

const followups = [
  {
    id: "1",
    description: "Lembrar assinatura do contrato",
    person: "João Silva",
    process: "PROC-002",
    status: "pending",
    executor: "ai",
    executorName: "Assistente Comercial",
    scheduledFor: "2024-01-22",
  },
  {
    id: "2",
    description: "Cobrar pagamento pendente",
    person: "Carlos Mendes",
    process: "PROC-004",
    status: "in_progress",
    executor: "ai",
    executorName: "Assistente Financeiro",
    scheduledFor: "2024-01-20",
  },
  {
    id: "3",
    description: "Confirmar recebimento do briefing",
    person: "Maria Santos",
    process: "PROC-001",
    status: "completed",
    executor: "human",
    executorName: "Ana Costa",
    scheduledFor: "2024-01-18",
  },
  {
    id: "4",
    description: "Reenviar link de pagamento",
    person: "Paula Rodrigues",
    process: "PROC-007",
    status: "failed",
    executor: "ai",
    executorName: "Assistente Comercial",
    scheduledFor: "2024-01-19",
  },
];

export default function FormalizationFollowups() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Follow-ups Administrativos</h1>
          <p className="text-muted-foreground">
            Acompanhe follow-ups de processos de formalização
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="text-xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="text-xl font-bold">45</p>
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
                  <p className="text-sm text-muted-foreground">Falharam</p>
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
                  <TableHead>Descrição</TableHead>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Executor</TableHead>
                  <TableHead>Agendado para</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {followups.map((followup) => (
                  <TableRow key={followup.id}>
                    <TableCell className="font-medium">{followup.description}</TableCell>
                    <TableCell>{followup.person}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{followup.process}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[followup.status].variant}>
                        {statusConfig[followup.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {followup.executor === "ai" ? (
                          <Bot className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{followup.executorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(followup.scheduledFor).toLocaleDateString("pt-BR")}
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
                            <Play className="h-4 w-4 mr-2" />
                            Executar Agora
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
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
