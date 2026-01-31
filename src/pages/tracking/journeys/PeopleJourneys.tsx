import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ExternalLink, ArrowRight } from "lucide-react";

const journeys = [
  {
    id: 1,
    person: { name: "Maria Silva", email: "maria@empresa.com" },
    origin: "Google Ads",
    campaign: "Black Friday 2024",
    funnel: "Funil de Vendas",
    currentStage: "Cliente",
    events: 12,
    result: "converted",
    revenue: 2970,
    duration: "3 dias",
  },
  {
    id: 2,
    person: { name: "João Santos", email: "joao@empresa.com" },
    origin: "Meta Ads",
    campaign: "Remarketing",
    funnel: "Funil de Vendas",
    currentStage: "Negociação",
    events: 8,
    result: "in_progress",
    revenue: null,
    duration: "5 dias",
  },
  {
    id: 3,
    person: { name: "Ana Costa", email: "ana@empresa.com" },
    origin: "Orgânico",
    campaign: null,
    funnel: "Funil Trial",
    currentStage: "Trial Ativo",
    events: 6,
    result: "in_progress",
    revenue: null,
    duration: "2 dias",
  },
  {
    id: 4,
    person: { name: "Carlos Lima", email: "carlos@empresa.com" },
    origin: "LinkedIn Ads",
    campaign: "B2B Demo",
    funnel: "Funil Enterprise",
    currentStage: "Cliente",
    events: 15,
    result: "converted",
    revenue: 12000,
    duration: "12 dias",
  },
  {
    id: 5,
    person: { name: "Paula Mendes", email: "paula@empresa.com" },
    origin: "Email",
    campaign: "Newsletter",
    funnel: "Funil de Vendas",
    currentStage: "Perdido",
    events: 4,
    result: "lost",
    revenue: null,
    duration: "7 dias",
  },
  {
    id: 6,
    person: { name: "Roberto Alves", email: "roberto@empresa.com" },
    origin: "Google Ads",
    campaign: "Search Marca",
    funnel: "Funil de Vendas",
    currentStage: "Proposta",
    events: 9,
    result: "in_progress",
    revenue: null,
    duration: "4 dias",
  },
];

const resultConfig = {
  converted: { label: "Convertido", color: "bg-success/10 text-success" },
  in_progress: { label: "Em Andamento", color: "bg-primary/10 text-primary" },
  lost: { label: "Perdido", color: "bg-destructive/10 text-destructive" },
};

export default function PeopleJourneys() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Jornadas de Pessoas
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe a jornada individual de cada pessoa
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar pessoa..." className="pl-9" />
              </div>

              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Funil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="vendas">Funil de Vendas</SelectItem>
                    <SelectItem value="trial">Funil Trial</SelectItem>
                    <SelectItem value="enterprise">Funil Enterprise</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="converted">Convertido</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journeys Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {journeys.length} jornadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Pessoa
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Origem
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Funil
                    </th>
                    <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Eventos
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Etapa Atual
                    </th>
                    <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Resultado
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Receita
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {journeys.map((journey) => {
                    const result =
                      resultConfig[journey.result as keyof typeof resultConfig];
                    return (
                      <tr
                        key={journey.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {journey.person.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {journey.person.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {journey.person.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div>
                            <p className="text-sm text-foreground">
                              {journey.origin}
                            </p>
                            {journey.campaign && (
                              <p className="text-xs text-muted-foreground">
                                {journey.campaign}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline">{journey.funnel}</Badge>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-medium text-foreground">
                            {journey.events}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-foreground">
                            {journey.currentStage}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <Badge variant="secondary" className={result.color}>
                            {result.label}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          {journey.revenue ? (
                            <span className="font-medium text-foreground">
                              R$ {journey.revenue.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm" className="gap-1">
                            Ver jornada
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
