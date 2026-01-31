import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ExternalLink,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const campaigns = [
  {
    id: 1,
    name: "Campanha Black Friday 2024",
    platform: "Google Ads",
    platformIcon: "G",
    status: "active",
    budget: "R$ 500/dia",
    spent: "R$ 12.450",
    impressions: 458000,
    clicks: 12450,
    ctr: 2.72,
    conversions: 342,
    cpa: "R$ 36.40",
    trend: "up",
  },
  {
    id: 2,
    name: "Remarketing - Carrinho Abandonado",
    platform: "Meta Ads",
    platformIcon: "M",
    status: "active",
    budget: "R$ 250/dia",
    spent: "R$ 6.780",
    impressions: 289000,
    clicks: 8920,
    ctr: 3.09,
    conversions: 215,
    cpa: "R$ 31.53",
    trend: "up",
  },
  {
    id: 3,
    name: "Prospecção - Lookalike Compradores",
    platform: "Meta Ads",
    platformIcon: "M",
    status: "active",
    budget: "R$ 400/dia",
    spent: "R$ 9.200",
    impressions: 512000,
    clicks: 15680,
    ctr: 3.06,
    conversions: 187,
    cpa: "R$ 49.20",
    trend: "down",
  },
  {
    id: 4,
    name: "Search - Termos de Marca",
    platform: "Google Ads",
    platformIcon: "G",
    status: "paused",
    budget: "R$ 150/dia",
    spent: "R$ 2.340",
    impressions: 95000,
    clicks: 3240,
    ctr: 3.41,
    conversions: 98,
    cpa: "R$ 23.88",
    trend: "neutral",
  },
  {
    id: 5,
    name: "Display - Awareness Q4",
    platform: "Google Ads",
    platformIcon: "G",
    status: "active",
    budget: "R$ 300/dia",
    spent: "R$ 7.800",
    impressions: 892000,
    clicks: 4560,
    ctr: 0.51,
    conversions: 45,
    cpa: "R$ 173.33",
    trend: "down",
  },
  {
    id: 6,
    name: "YouTube - Vídeo Institucional",
    platform: "Google Ads",
    platformIcon: "G",
    status: "learning",
    budget: "R$ 200/dia",
    spent: "R$ 1.200",
    impressions: 156000,
    clicks: 890,
    ctr: 0.57,
    conversions: 12,
    cpa: "R$ 100.00",
    trend: "neutral",
  },
];

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  active: { label: "Ativo", variant: "default" },
  paused: { label: "Pausado", variant: "secondary" },
  learning: { label: "Aprendendo", variant: "outline" },
};

export default function CampaignsList() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Campanhas
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as suas campanhas de mídia paga
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar campanhas..."
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="learning">Aprendendo</SelectItem>
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

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {campaigns.length} campanhas encontradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Campanha
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
                  {campaigns.map((campaign) => {
                    const status = statusConfig[campaign.status];
                    return (
                      <tr
                        key={campaign.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/trafego/campanhas/${campaign.id}/grupos`)
                        }
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-md flex items-center justify-center ${
                                campaign.platform === "Google Ads"
                                  ? "bg-blue-500"
                                  : "bg-blue-600"
                              }`}
                            >
                              <span className="text-white text-xs font-bold">
                                {campaign.platformIcon}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {campaign.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {campaign.platform}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={status.variant}
                            className={
                              campaign.status === "active"
                                ? "bg-success/10 text-success hover:bg-success/20"
                                : ""
                            }
                          >
                            {status.label}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm text-foreground">
                              {campaign.budget}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Gasto: {campaign.spent}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {campaign.impressions.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {campaign.clicks.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="font-medium text-foreground">
                              {campaign.ctr.toFixed(2)}%
                            </span>
                            {campaign.trend === "up" && (
                              <TrendingUp className="h-3.5 w-3.5 text-success" />
                            )}
                            {campaign.trend === "down" && (
                              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {campaign.conversions.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {campaign.cpa}
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
                              {campaign.status === "active" ? (
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
