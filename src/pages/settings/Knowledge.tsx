import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Book, 
  Plus,
  Search,
  FileText,
  Bot,
  Users,
  Globe,
  Layers,
  ChevronRight,
  MoreHorizontal,
  Tag
} from "lucide-react";

const mockPlaybooks = [
  {
    id: 1,
    name: "Processo de Vendas",
    type: "Vendas",
    status: "Ativo",
    version: "2.1",
    scope: "Global",
    aiEnabled: true,
    humanEnabled: true,
    tags: ["vendas", "qualificação", "fechamento"]
  },
  {
    id: 2,
    name: "Atendimento ao Cliente",
    type: "Atendimento",
    status: "Ativo",
    version: "1.5",
    scope: "Comunicação",
    aiEnabled: true,
    humanEnabled: true,
    tags: ["suporte", "FAQ", "resolução"]
  },
  {
    id: 3,
    name: "Política de Descontos",
    type: "Políticas",
    status: "Ativo",
    version: "3.0",
    scope: "Comercial",
    aiEnabled: false,
    humanEnabled: true,
    tags: ["preços", "negociação"]
  },
  {
    id: 4,
    name: "Tratamento de Objeções",
    type: "Vendas",
    status: "Ativo",
    version: "1.2",
    scope: "Global",
    aiEnabled: true,
    humanEnabled: true,
    tags: ["objeções", "argumentação"]
  },
  {
    id: 5,
    name: "Exceções de Pagamento",
    type: "Exceções",
    status: "Obsoleto",
    version: "1.0",
    scope: "Formalização",
    aiEnabled: false,
    humanEnabled: true,
    tags: ["pagamentos", "exceções"]
  },
];

const types = ["Todos", "Vendas", "Atendimento", "Suporte", "Políticas", "Exceções"];

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");

  const filteredPlaybooks = mockPlaybooks.filter(playbook => {
    const matchesSearch = playbook.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Todos" || playbook.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Conhecimento & Playbooks</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Conhecimento & Playbooks</h1>
            <p className="text-muted-foreground mt-1">
              Base de conhecimento operacional para IA e equipe.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Playbook
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">12</p>
                  <p className="text-sm text-muted-foreground">Playbooks Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">8</p>
                  <p className="text-sm text-muted-foreground">Disponíveis para IA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">12</p>
                  <p className="text-sm text-muted-foreground">Disponíveis p/ Humanos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">2</p>
                  <p className="text-sm text-muted-foreground">Obsoletos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar playbooks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Playbooks Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Playbook</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Escopo</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Bot className="h-4 w-4" />
                    <span>IA</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Humanos</span>
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlaybooks.map((playbook) => (
                <TableRow key={playbook.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{playbook.name}</p>
                      <div className="flex gap-1 mt-1">
                        {playbook.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{playbook.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    v{playbook.version}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {playbook.scope === "Global" ? (
                        <Globe className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Layers className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-sm">{playbook.scope}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={playbook.aiEnabled} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={playbook.humanEnabled} />
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        playbook.status === "Ativo" 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                          : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                      }
                    >
                      {playbook.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
