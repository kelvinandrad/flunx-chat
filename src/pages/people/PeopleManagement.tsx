import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Briefcase,
  Route,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { usePeople, type Person } from "@/hooks/usePeople";
import { PersonFormDialog } from "@/components/people/PersonFormDialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors: Record<string, string> = {
  Ativo: "bg-emerald-500/10 text-emerald-600",
  Pendente: "bg-amber-500/10 text-amber-600",
  Inativo: "bg-gray-500/10 text-gray-500",
};

export default function PeopleManagement() {
  const navigate = useNavigate();
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const { data: people = [], isLoading, error } = usePeople(searchQuery);

  // Apply client-side filters
  const filteredPeople = people.filter((person) => {
    if (statusFilter !== "all" && person.status !== statusFilter) return false;
    if (originFilter !== "all" && person.origin !== originFilter) return false;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedPeople.length === filteredPeople.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(filteredPeople.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedPeople((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingPerson(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Gestão de Pessoas</h1>
            <p className="text-muted-foreground mt-1">
              Visão centralizada de todas as pessoas do seu sistema
            </p>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Criar Pessoa
          </Button>
        </div>

        {/* Filters Bar */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email, telefone..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={originFilter} onValueChange={setOriginFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Orgânico">Orgânico</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Webchat">Webchat</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros Avançados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-destructive">
                Erro ao carregar pessoas. Tente novamente.
              </div>
            ) : filteredPeople.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">Nenhuma pessoa encontrada</p>
                <p className="text-sm">Crie a primeira pessoa clicando no botão acima.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedPeople.length === filteredPeople.length && filteredPeople.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPeople.map((person) => (
                        <TableRow
                          key={person.id}
                          className="cursor-pointer hover:bg-muted/50 border-border"
                          onClick={() => navigate(`/pessoas/${person.id}`)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedPeople.includes(person.id)}
                              onCheckedChange={() => toggleSelect(person.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={person.avatar_url || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(person.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{person.name}</p>
                                <p className="text-sm text-muted-foreground">{person.email || "—"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {person.status && (
                              <Badge
                                variant="secondary"
                                className={statusColors[person.status] || ""}
                              >
                                {person.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(person.tags) &&
                                (person.tags as string[]).slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="bg-muted/50 text-muted-foreground border-border"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              {Array.isArray(person.tags) && (person.tags as string[]).length > 3 && (
                                <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">
                                  +{(person.tags as string[]).length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{person.origin || "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{person.company || "—"}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(person.created_at)}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                                <DropdownMenuItem
                                  onClick={() => navigate(`/pessoas/${person.id}`)}
                                  className="gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2" onClick={() => handleEdit(person)}>
                                  <Edit className="h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Briefcase className="h-4 w-4" />
                                  Acessar CRM
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Route className="h-4 w-4" />
                                  Acessar Jornada
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Mostrando <span className="font-medium">{filteredPeople.length}</span> pessoa(s)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="min-w-[40px]">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <PersonFormDialog open={isFormOpen} onOpenChange={handleCloseForm} person={editingPerson} />
    </AppLayout>
  );
}
