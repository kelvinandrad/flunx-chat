import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Eye,
  Pause,
  Play,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const adGroups = [
  {
    id: 1,
    name: "Grupo - Termos Genéricos",
    campaign: "Campanha Black Friday 2024",
    status: "active",
    budget: "R$ 150/dia",
    impressions: 185000,
    clicks: 4890,
    ctr: 2.64,
    conversions: 124,
    cpa: "R$ 28.50",
    trend: "up",
  },
  {
    id: 2,
    name: "Grupo - Termos de Marca",
    campaign: "Campanha Black Friday 2024",
    status: "active",
    budget: "R$ 100/dia",
    impressions: 72000,
    clicks: 3200,
    ctr: 4.44,
    conversions: 98,
    cpa: "R$ 18.90",
    trend: "up",
  },
  {
    id: 3,
    name: "Grupo - Concorrentes",
    campaign: "Campanha Black Friday 2024",
    status: "active",
    budget: "R$ 200/dia",
    impressions: 156000,
    clicks: 3450,
    ctr: 2.21,
    conversions: 85,
    cpa: "R$ 45.60",
    trend: "down",
  },
  {
    id: 4,
    name: "Grupo - Long Tail",
    campaign: "Campanha Black Friday 2024",
    status: "paused",
    budget: "R$ 50/dia",
    impressions: 45000,
    clicks: 910,
    ctr: 2.02,
    conversions: 35,
    cpa: "R$ 32.10",
    trend: "neutral",
  },
];

export default function AdGroups() {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/trafego">Tráfego & Ads</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/trafego/campanhas">
                Campanhas
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/trafego/campanhas/${campaignId}`}>
                Campanha Black Friday 2024
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Grupos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Grupos / Conjuntos
            </h1>
            <p className="text-sm text-muted-foreground">
              Campanha Black Friday 2024 • Google Ads
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Grupo
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar grupos..." className="pl-9" />
              </div>

              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="30d">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {adGroups.length} grupos encontrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Grupo / Conjunto
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Orçamento
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Impressões
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Cliques
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Conversões
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      CPA
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {adGroups.map((group) => (
                    <tr
                      key={group.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/trafego/campanhas/${campaignId}/grupos/${group.id}/anuncios`
                        )
                      }
                    >
                      <td className="py-4">
                        <p className="font-medium text-foreground">
                          {group.name}
                        </p>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            group.status === "active" ? "default" : "secondary"
                          }
                          className={
                            group.status === "active"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : ""
                          }
                        >
                          {group.status === "active" ? "Ativo" : "Pausado"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-foreground">
                          {group.budget}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-medium text-foreground">
                          {group.impressions.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-medium text-foreground">
                          {group.clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="font-medium text-foreground">
                            {group.ctr.toFixed(2)}%
                          </span>
                          {group.trend === "up" && (
                            <TrendingUp className="h-3.5 w-3.5 text-success" />
                          )}
                          {group.trend === "down" && (
                            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-medium text-foreground">
                          {group.conversions.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-medium text-foreground">
                          {group.cpa}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {group.status === "active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
