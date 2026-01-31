import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  MoreHorizontal,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useOpportunities } from "@/hooks/useOpportunities";
import { usePipelineStages } from "@/hooks/usePipelineStages";

export default function Salespeople() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: members = [], isLoading: membersLoading } = useOrganizationMembers();
  const { data: opportunities = [], isLoading: oppsLoading } = useOpportunities();
  const { data: stages = [] } = usePipelineStages();

  // Find the "Fechamento" stage
  const closingStage = stages.find((s) => s.name === "Fechamento");

  // Aggregate data per member
  const salespeople = members.map((member) => {
    const memberOpps = opportunities.filter((o) => o.owner_id === member.user_id);
    const openOpps = memberOpps.filter((o) => o.stage_id !== closingStage?.id);
    const closedOpps = memberOpps.filter((o) => o.stage_id === closingStage?.id);
    const revenue = closedOpps.reduce((sum, o) => sum + (o.value || 0), 0);

    return {
      ...member,
      openOpportunities: openOpps.length,
      closedOpportunities: closedOpps.length,
      revenue,
      totalOpportunities: memberOpps.length,
    };
  });

  const filteredSalespeople = salespeople.filter(
    (person) =>
      person.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
    }).format(value);
  };

  const totalRevenue = salespeople.reduce((acc, p) => acc + p.revenue, 0);
  const totalOpen = salespeople.reduce((acc, p) => acc + p.openOpportunities, 0);
  const totalClosed = salespeople.reduce((acc, p) => acc + p.closedOpportunities, 0);

  const isLoading = membersLoading || oppsLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Vendedores & Times</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie sua equipe comercial e acompanhe a performance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendedores</p>
                  <p className="text-xl font-semibold">{members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Fechada</p>
                  <p className="text-xl font-semibold">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Aberto</p>
                  <p className="text-xl font-semibold">{totalOpen}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fechadas</p>
                  <p className="text-xl font-semibold">{totalClosed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="salespeople" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="salespeople">Vendedores</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          {/* Salespeople Tab */}
          <TabsContent value="salespeople" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Lista de Vendedores</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar vendedor..."
                      className="pl-9 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredSalespeople.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Nenhum vendedor encontrado</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredSalespeople.map((person) => (
                      <Card key={person.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={person.profiles?.avatar_url || undefined} />
                                <AvatarFallback>
                                  {(person.profiles?.full_name || person.profiles?.email || "?")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {person.profiles?.full_name || person.profiles?.email || "Sem nome"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {person.profiles?.email}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {person.role}
                                </Badge>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Enviar email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Ligar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-lg font-semibold">{person.openOpportunities}</p>
                              <p className="text-xs text-muted-foreground">Em aberto</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold">{person.closedOpportunities}</p>
                              <p className="text-xs text-muted-foreground">Fechadas</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold">
                                {formatCurrency(person.revenue)}
                              </p>
                              <p className="text-xs text-muted-foreground">Receita</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ranking Tab */}
          <TabsContent value="ranking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Ranking de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead className="text-center">Oportunidades</TableHead>
                      <TableHead className="text-center">Fechadas</TableHead>
                      <TableHead className="text-right">Receita</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...filteredSalespeople]
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((person, index) => (
                        <TableRow key={person.id}>
                          <TableCell>
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                                index === 0
                                  ? "bg-amber-500/20 text-amber-600"
                                  : index === 1
                                  ? "bg-slate-300/50 text-slate-600"
                                  : index === 2
                                  ? "bg-orange-400/20 text-orange-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {(person.profiles?.full_name || "?")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {person.profiles?.full_name || person.profiles?.email || "Sem nome"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {person.profiles?.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{person.role}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {person.totalOpportunities}
                          </TableCell>
                          <TableCell className="text-center">
                            {person.closedOpportunities}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(person.revenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
