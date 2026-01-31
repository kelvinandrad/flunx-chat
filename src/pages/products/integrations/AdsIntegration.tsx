import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Megaphone, 
  Tag,
  Link,
  Image,
  TrendingUp,
  DollarSign,
  Eye
} from "lucide-react";

const offerCampaigns = [
  {
    id: 1,
    offer: "Enterprise Anual - Black Friday",
    campaigns: [
      { name: "BF2024_Enterprise_FB", platform: "Meta Ads", spend: "R$ 12.500", conversions: 45, cpa: "R$ 277" },
      { name: "BF2024_Enterprise_Google", platform: "Google Ads", spend: "R$ 8.900", conversions: 32, cpa: "R$ 278" },
    ],
    utms: ["utm_campaign=blackfriday2024", "utm_source=facebook", "utm_medium=cpc"],
    creatives: 8,
    totalConversions: 77,
    revenue: "R$ 191.730"
  },
  {
    id: 2,
    offer: "Consultoria Express",
    campaigns: [
      { name: "Consultoria_Remarketing", platform: "Meta Ads", spend: "R$ 4.200", conversions: 12, cpa: "R$ 350" },
    ],
    utms: ["utm_campaign=consultoria", "utm_source=meta"],
    creatives: 4,
    totalConversions: 12,
    revenue: "R$ 58.800"
  },
  {
    id: 3,
    offer: "Setup Premium + 3 meses",
    campaigns: [
      { name: "Setup_Lookalike", platform: "Meta Ads", spend: "R$ 6.800", conversions: 28, cpa: "R$ 243" },
      { name: "Setup_Search", platform: "Google Ads", spend: "R$ 5.100", conversions: 19, cpa: "R$ 268" },
    ],
    utms: ["utm_campaign=setup_premium", "utm_source=google"],
    creatives: 6,
    totalConversions: 47,
    revenue: "R$ 93.530"
  },
];

export default function AdsIntegration() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integração com Ads</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe a performance de ofertas por campanha e criativo
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investimento Total</p>
                  <p className="text-2xl font-bold text-foreground">R$ 37.5k</p>
                </div>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversões</p>
                  <p className="text-2xl font-bold text-foreground">136</p>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CPA Médio</p>
                  <p className="text-2xl font-bold text-foreground">R$ 276</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500">-8%</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ROAS</p>
                  <p className="text-2xl font-bold text-foreground">9.2x</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500">Excelente</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offer-Campaign Breakdown */}
        <div className="space-y-6">
          {offerCampaigns.map((item) => (
            <Card key={item.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.offer}</CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.totalConversions} conversões
                        </Badge>
                        <span className="text-sm font-medium text-emerald-500">{item.revenue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Image className="h-3 w-3" />
                      {item.creatives} criativos
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Campaigns */}
                <div className="space-y-3">
                  {item.campaigns.map((campaign, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{campaign.name}</p>
                          <Badge variant="secondary" className="mt-1 text-xs bg-muted">
                            {campaign.platform}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-medium text-foreground">{campaign.spend}</p>
                          <p className="text-xs text-muted-foreground">investido</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{campaign.conversions}</p>
                          <p className="text-xs text-muted-foreground">conversões</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{campaign.cpa}</p>
                          <p className="text-xs text-muted-foreground">CPA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* UTMs */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  {item.utms.map((utm, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-mono">
                      {utm}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
