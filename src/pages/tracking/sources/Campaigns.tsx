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
import { Plus, Search, ExternalLink } from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Black Friday 2024",
    source: "Google Ads",
    funnel: "Funil de Vendas",
    offers: ["Oferta BF 50% OFF", "Oferta BF Combo"],
    status: "active",
    leads: 1245,
    conversions: 186,
    revenue: 98400,
  },
  {
    id: 2,
    name: "Remarketing Carrinho",
    source: "Meta Ads",
    funnel: "Funil de Vendas",
    offers: ["Oferta Recuperação"],
    status: "active",
    leads: 890,
    conversions: 124,
    revenue: 67200,
  },
  {
    id: 3,
    name: "Prospecção Lookalike",
    source: "Meta Ads",
    funnel: "Funil Trial",
    offers: ["Oferta Trial Gratuito"],
    status: "active",
    leads: 2340,
    conversions: 98,
    revenue: 52100,
  },
  {
    id: 4,
    name: "Webinar Dezembro",
    source: "Email",
    funnel: "Funil Educacional",
    offers: ["Oferta Pós-Webinar"],
    status: "active",
    leads: 560,
    conversions: 78,
    revenue: 41800,
  },
  {
    id: 5,
    name: "Newsletter Mensal",
    source: "Email",
    funnel: "Funil Nurturing",
    offers: ["Oferta Newsletter"],
    status: "active",
    leads: 320,
    conversions: 45,
    revenue: 24500,
  },
  {
    id: 6,
    name: "Campanha Q3 2024",
    source: "Google Ads",
    funnel: "Funil de Vendas",
    offers: ["Oferta Q3"],
    status: "paused",
    leads: 1890,
    conversions: 156,
    revenue: 78900,
  },
  {
    id: 7,
    name: "LinkedIn B2B",
    source: "LinkedIn Ads",
    funnel: "Funil Enterprise",
    offers: ["Oferta Enterprise Demo"],
    status: "active",
    leads: 180,
    conversions: 34,
    revenue: 89500,
  },
];

export default function TrackingCampaigns() {
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
              Rastreie suas campanhas e seus vínculos com funis e ofertas
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
                <Input placeholder="Buscar campanhas..." className="pl-9" />
              </div>

              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {campaigns.length} campanhas cadastradas
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
                      Fonte
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Funil
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ofertas
                    </th>
                    <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Conversões
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Receita
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {campaign.name}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground">
                          {campaign.source}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">{campaign.funnel}</Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {campaign.offers.map((offer) => (
                            <Badge
                              key={offer}
                              variant="secondary"
                              className="text-xs"
                            >
                              {offer}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            campaign.status === "active"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : ""
                          }
                        >
                          {campaign.status === "active" ? "Ativo" : "Pausado"}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          {campaign.leads.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          {campaign.conversions.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-foreground">
                          R$ {campaign.revenue.toLocaleString()}
                        </span>
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
