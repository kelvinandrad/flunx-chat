import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Clock,
  BarChart3,
  Target,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const attributionModels = [
  {
    id: "first_touch",
    name: "First Touch",
    description:
      "100% do crédito vai para o primeiro ponto de contato. Ideal para entender quais canais geram awareness inicial.",
    icon: Zap,
    example: "Se o cliente veio do Google Ads → Email → Direto, Google Ads recebe 100%.",
    bestFor: ["Campanhas de topo de funil", "Análise de awareness", "Aquisição"],
  },
  {
    id: "last_touch",
    name: "Last Touch",
    description:
      "100% do crédito vai para o último ponto de contato antes da conversão. Simples e direto.",
    icon: Target,
    example: "Se o cliente veio do Google Ads → Email → Direto, Direto recebe 100%.",
    bestFor: ["Análise de fechamento", "Campanhas de fundo de funil", "ROI direto"],
  },
  {
    id: "linear",
    name: "Linear",
    description:
      "O crédito é dividido igualmente entre todos os pontos de contato. Visão equilibrada da jornada.",
    icon: BarChart3,
    example: "Se o cliente veio do Google Ads → Email → Direto, cada um recebe 33.3%.",
    bestFor: ["Jornadas longas", "Múltiplos touchpoints", "Visão holística"],
  },
  {
    id: "time_decay",
    name: "Time Decay",
    description:
      "Pontos de contato mais próximos da conversão recebem mais crédito. O peso diminui com o tempo.",
    icon: Clock,
    example: "Se o cliente veio do Google Ads → Email → Direto, Direto recebe ~50%, Email ~30%, Google ~20%.",
    bestFor: ["Ciclos de venda curtos", "Decisões rápidas", "E-commerce"],
  },
  {
    id: "position_based",
    name: "Position-based (U-Shaped)",
    description:
      "40% para o primeiro, 40% para o último, 20% dividido entre os intermediários.",
    icon: BarChart3,
    example: "Se o cliente veio do Google Ads → Email → Direto, Google e Direto recebem 40% cada, Email 20%.",
    bestFor: ["Jornadas com vários touchpoints", "B2B", "Vendas complexas"],
  },
];

export default function AttributionModels() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Modelos de Atribuição
          </h1>
          <p className="text-sm text-muted-foreground">
            Entenda como cada modelo distribui o crédito da conversão
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            A escolha do modelo de atribuição impacta diretamente na análise de
            performance dos seus canais. Não existe modelo "certo" — cada um é
            ideal para diferentes contextos e objetivos de negócio.
          </AlertDescription>
        </Alert>

        {/* Models Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {attributionModels.map((model) => {
            const Icon = model.icon;
            return (
              <Card key={model.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-medium">
                      {model.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {model.description}
                  </p>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Exemplo:
                    </p>
                    <p className="text-xs text-foreground">{model.example}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-2">
                      Melhor para:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {model.bestFor.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="text-xs"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Visual Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Comparação Visual dos Modelos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] space-y-6 py-4">
                {/* Journey representation */}
                <div className="flex items-center justify-between px-8">
                  <Badge className="bg-primary text-primary-foreground">
                    Google Ads
                  </Badge>
                  <div className="h-0.5 flex-1 mx-4 bg-border" />
                  <Badge variant="outline">Email</Badge>
                  <div className="h-0.5 flex-1 mx-4 bg-border" />
                  <Badge variant="outline">Direto</Badge>
                  <div className="h-0.5 flex-1 mx-4 bg-border" />
                  <Badge className="bg-success text-success-foreground">
                    Conversão
                  </Badge>
                </div>

                {/* Model distributions */}
                <div className="space-y-4">
                  {[
                    { name: "First Touch", values: [100, 0, 0] },
                    { name: "Last Touch", values: [0, 0, 100] },
                    { name: "Linear", values: [33.3, 33.3, 33.4] },
                    { name: "Time Decay", values: [20, 30, 50] },
                    { name: "Position-based", values: [40, 20, 40] },
                  ].map((model) => (
                    <div key={model.name} className="flex items-center gap-4">
                      <span className="w-32 text-sm font-medium">
                        {model.name}
                      </span>
                      <div className="flex-1 flex items-center gap-4 px-8">
                        {model.values.map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 flex items-center justify-center"
                          >
                            <div
                              className={`h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${
                                value > 0
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                              style={{
                                width: `${Math.max(value, 10)}%`,
                                minWidth: value > 0 ? "40px" : "20px",
                              }}
                            >
                              {value > 0 ? `${value}%` : "-"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
