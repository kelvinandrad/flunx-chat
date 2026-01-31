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
  FileText,
  Send,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  draft: { label: "Rascunho", variant: "secondary", icon: FileText },
  sent: { label: "Enviado", variant: "outline", icon: Send },
  signed: { label: "Assinado", variant: "default", icon: CheckCircle },
  expired: { label: "Expirado", variant: "destructive", icon: Clock },
};

const documents = [
  {
    id: "1",
    type: "Contrato de Prestação de Serviços",
    person: "Maria Santos",
    process: "PROC-001",
    version: 1,
    status: "signed",
    platform: "Autentique",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    type: "Termo de Confidencialidade",
    person: "Maria Santos",
    process: "PROC-001",
    version: 1,
    status: "sent",
    platform: "Autentique",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    type: "Contrato de Prestação de Serviços",
    person: "João Silva",
    process: "PROC-002",
    version: 1,
    status: "draft",
    platform: null,
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    type: "Anamnese Comercial",
    person: "Ana Costa",
    process: "PROC-003",
    version: 2,
    status: "signed",
    platform: "Autentique",
    createdAt: "2024-01-10",
  },
];

export default function AllDocuments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Todos os Documentos</h1>
            <p className="text-muted-foreground">
              Gerencie documentos de processos de formalização
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Documento
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
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
                  <TableHead>Tipo de Documento</TableHead>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const StatusIcon = statusConfig[doc.status].icon;
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{doc.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{doc.person}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.process}</Badge>
                      </TableCell>
                      <TableCell>v{doc.version}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[doc.status].variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[doc.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.platform ? (
                          <span className="text-sm">{doc.platform}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString("pt-BR")}
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
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Criar Nova Versão
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Reenviar
                            </DropdownMenuItem>
                            {doc.platform && (
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Abrir no {doc.platform}
                              </DropdownMenuItem>
                            )}
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
