import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  FileText,
  CreditCard,
  Bot,
  XCircle,
  Eye,
  User,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  FileSignature,
  DollarSign
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Rascunho", variant: "secondary" },
  formalizing: { label: "Em Formalização", variant: "outline" },
  awaiting_payment: { label: "Aguardando Pagamento", variant: "default" },
  in_progress: { label: "Em Andamento", variant: "default" },
  completed: { label: "Concluído", variant: "secondary" },
  at_risk: { label: "Em Risco", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "secondary" },
};

const processes = [
  {
    id: "1",
    person: "Maria Santos",
    company: "Tech Solutions",
    product: "Consultoria Premium",
    status: "awaiting_payment",
    documents: { total: 2, signed: 1 },
    payments: { total: 3, paid: 1 },
    aiAgent: "Assistente Comercial",
    nextStep: "Aguardar pagamento da 1ª parcela",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    person: "João Silva",
    company: "Startup ABC",
    product: "Pacote Essencial",
    status: "formalizing",
    documents: { total: 1, signed: 0 },
    payments: { total: 1, paid: 0 },
    aiAgent: null,
    nextStep: "Enviar contrato para assinatura",
    createdAt: "2024-01-18",
  },
  {
    id: "3",
    person: "Ana Costa",
    company: "Corp Enterprise",
    product: "Plano Anual",
    status: "completed",
    documents: { total: 3, signed: 3 },
    payments: { total: 12, paid: 12 },
    aiAgent: "Assistente Administrativo",
    nextStep: "Processo finalizado",
    createdAt: "2023-06-10",
  },
  {
    id: "4",
    person: "Carlos Mendes",
    company: null,
    product: "Mentoria Individual",
    status: "at_risk",
    documents: { total: 1, signed: 1 },
    payments: { total: 6, paid: 2 },
    aiAgent: "Assistente Financeiro",
    nextStep: "Cobrar parcelas em atraso",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    person: "Fernanda Lima",
    company: "Design Studio",
    product: "Consultoria Premium",
    status: "in_progress",
    documents: { total: 2, signed: 2 },
    payments: { total: 4, paid: 2 },
    aiAgent: null,
    nextStep: "Aguardar próximo vencimento",
    createdAt: "2024-01-10",
  },
];

const timelineEvents = [
  { type: "created", description: "Processo criado", date: "15/01/2024 09:30", icon: FileSignature },
  { type: "document", description: "Contrato gerado", date: "15/01/2024 09:35", icon: FileText },
  { type: "sent", description: "Contrato enviado para assinatura", date: "15/01/2024 10:00", icon: Send },
  { type: "signed", description: "Contrato assinado pela cliente", date: "16/01/2024 14:22", icon: CheckCircle },
  { type: "charge", description: "Cobrança gerada - R$ 4.500", date: "16/01/2024 14:30", icon: CreditCard },
  { type: "payment", description: "Pagamento confirmado", date: "17/01/2024 08:15", icon: DollarSign },
];

export default function AllProcesses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProcess, setSelectedProcess] = useState<typeof processes[0] | null>(null);

  const filteredProcesses = processes.filter((process) => {
    const matchesSearch = 
      process.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || process.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Todos os Processos</h1>
            <p className="text-muted-foreground">
              Gerencie processos de formalização e receita
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por pessoa ou produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
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
                  <TableHead>Produto / Oferta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Pagamentos</TableHead>
                  <TableHead>IA Responsável</TableHead>
                  <TableHead>Próximo Passo</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process) => (
                  <TableRow 
                    key={process.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedProcess(process)}
                  >
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
                      <Badge variant={statusConfig[process.status].variant}>
                        {statusConfig[process.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={process.documents.signed === process.documents.total ? "text-emerald-500" : ""}>
                        {process.documents.signed}/{process.documents.total}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={process.payments.paid === process.payments.total ? "text-emerald-500" : ""}>
                        {process.payments.paid}/{process.payments.total}
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
                    <TableCell className="text-muted-foreground">
                      {new Date(process.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedProcess(process)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Abrir Processo
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Criar Documento
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Criar Cobrança
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bot className="h-4 w-4 mr-2" />
                            Acionar IA
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar Processo
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

      {/* Process Detail Sheet */}
      <Sheet open={!!selectedProcess} onOpenChange={() => setSelectedProcess(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedProcess && (
            <>
              <SheetHeader>
                <SheetTitle>Detalhes do Processo</SheetTitle>
                <SheetDescription>
                  {selectedProcess.person} - {selectedProcess.product}
                </SheetDescription>
              </SheetHeader>
              
              <Tabs defaultValue="context" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="context">Contexto</TabsTrigger>
                  <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                  <TabsTrigger value="actions">Ações</TabsTrigger>
                </TabsList>

                <TabsContent value="context" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pessoa</p>
                        <p className="font-medium">{selectedProcess.person}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Produto / Oferta</p>
                        <p className="font-medium">{selectedProcess.product}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Estado Administrativo</p>
                        <Badge variant={statusConfig[selectedProcess.status].variant} className="mt-1">
                          {statusConfig[selectedProcess.status].label}
                        </Badge>
                      </div>
                    </div>

                    {selectedProcess.aiAgent && (
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Bot className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">IA Responsável</p>
                          <p className="font-medium">{selectedProcess.aiAgent}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="p-2 rounded-full bg-muted">
                            <event.icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          {index < timelineEvents.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="mt-4">
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Novo Documento
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar para Assinatura
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Gerar Cobrança
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bot className="h-4 w-4 mr-2" />
                      Acionar Follow-up por IA
                    </Button>
                    <Button className="w-full justify-start" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Encerrar Processo
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
