import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  ArrowRight,
  Tag,
  Zap,
  RotateCcw,
  TrendingUp
} from "lucide-react";

const funnelOffers = [
  {
    id: 1,
    offer: "Enterprise Anual - Black Friday",
    funnels: [
      { name: "Funil de Vendas Principal", stages: ["Qualificação", "Proposta"], type: "entrada" },
      { name: "Funil de Reativação", stages: ["Reengajamento"], type: "upsell" },
    ],
    conversions: 156
  },
  {
    id: 2,
    offer: "Consultoria Express",
    funnels: [
      { name: "Funil Pós-Venda", stages: ["Onboarding", "Sucesso"], type: "upsell" },
    ],
    conversions: 45
  },
  {
    id: 3,
    offer: "Plano Básico Mensal",
    funnels: [
      { name: "Funil de Vendas Principal", stages: ["Negociação"], type: "downsell" },
      { name: "Funil de Trial", stages: ["Conversão"], type: "entrada" },
    ],
    conversions: 234
  },
];

const offerTypes = [
  { type: "entrada", label: "Entrada", color: "bg-primary/10 text-primary" },
  { type: "upsell", label: "Upsell", color: "bg-emerald-500/10 text-emerald-500" },
  { type: "downsell", label: "Downsell", color: "bg-amber-500/10 text-amber-500" },
  { type: "retencao", label: "Retenção", color: "bg-purple-500/10 text-purple-500" },
];

export default function FunnelIntegration() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integração com Funis</h1>
            <p className="text-muted-foreground mt-1">
              Visualize como ofertas se conectam aos funis de conversão
            </p>
          </div>
        </div>

        {/* Legend */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-sm font-medium text-foreground">Tipos de oferta:</span>
              {offerTypes.map((type) => (
                <Badge key={type.type} className={type.color}>
                  {type.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offer-Funnel Connections */}
        <div className="space-y-4">
          {funnelOffers.map((item) => (
            <Card key={item.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Offer */}
                  <div className="flex-shrink-0 w-64">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.offer}</p>
                        <p className="text-sm text-muted-foreground">{item.conversions} conversões</p>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground mt-3 flex-shrink-0" />

                  {/* Funnels */}
                  <div className="flex-1 space-y-3">
                    {item.funnels.map((funnel, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{funnel.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Etapas: {funnel.stages.join(", ")}
                            </p>
                          </div>
                        </div>
                        <Badge className={
                          funnel.type === 'entrada' ? 'bg-primary/10 text-primary' :
                          funnel.type === 'upsell' ? 'bg-emerald-500/10 text-emerald-500' :
                          funnel.type === 'downsell' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-purple-500/10 text-purple-500'
                        }>
                          {funnel.type === 'entrada' ? 'Entrada' :
                           funnel.type === 'upsell' ? 'Upsell' :
                           funnel.type === 'downsell' ? 'Downsell' : 'Retenção'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Ofertas de Entrada</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Ofertas de Upsell</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <p className="text-sm text-muted-foreground">Ofertas de Retenção</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
