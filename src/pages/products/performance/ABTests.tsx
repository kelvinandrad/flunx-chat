import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Split,
  TrendingUp,
  Clock,
  CheckCircle2,
  Pause,
  Play,
  ArrowRight
} from "lucide-react";

const activeTests = [
  {
    id: 1,
    name: "Preço Enterprise",
    status: "running",
    variants: [
      { name: "Controle (R$ 2.490)", visitors: 1234, conversions: 89, rate: 7.2 },
      { name: "Variante A (R$ 1.990)", visitors: 1256, conversions: 112, rate: 8.9 },
    ],
    uplift: "+23.6%",
    confidence: 94,
    startDate: "15/06/2024",
    duration: "14 dias"
  },
  {
    id: 2,
    name: "Copy da Headline",
    status: "running",
    variants: [
      { name: "Controle: 'Transforme sua operação'", visitors: 890, conversions: 45, rate: 5.1 },
      { name: "Variante: 'Economize 40% do tempo'", visitors: 912, conversions: 67, rate: 7.3 },
    ],
    uplift: "+43.1%",
    confidence: 97,
    startDate: "20/06/2024",
    duration: "9 dias"
  },
  {
    id: 3,
    name: "Oferta de Trial",
    status: "paused",
    variants: [
      { name: "Controle: 7 dias", visitors: 456, conversions: 23, rate: 5.0 },
      { name: "Variante: 14 dias", visitors: 478, conversions: 34, rate: 7.1 },
    ],
    uplift: "+42.0%",
    confidence: 88,
    startDate: "10/06/2024",
    duration: "Pausado"
  },
];

const completedTests = [
  {
    id: 4,
    name: "Preço Setup",
    winner: "Variante B (R$ 1.490)",
    uplift: "+34%",
    conclusion: "Preço menor aumentou conversões sem impactar receita",
    implemented: true
  },
  {
    id: 5,
    name: "CTA Button Color",
    winner: "Controle (Verde)",
    uplift: "0%",
    conclusion: "Sem diferença significativa",
    implemented: false
  },
];

export default function ABTests() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Testes A/B de Ofertas</h1>
            <p className="text-muted-foreground mt-1">
              Compare variações de preço, copy e ofertas
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Teste
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Testes Ativos</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Split className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uplift Médio</p>
                  <p className="text-2xl font-bold text-foreground">+28%</p>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Testes Concluídos</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-foreground">67%</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500">8/12</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Tests */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Testes em Andamento</h2>
          {activeTests.map((test) => (
            <Card key={test.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      test.status === 'running' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                    }`}>
                      <Split className={`h-5 w-5 ${
                        test.status === 'running' ? 'text-emerald-500' : 'text-amber-500'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={test.status === 'running' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-amber-500/10 text-amber-500'
                          }
                        >
                          {test.status === 'running' ? 'Em execução' : 'Pausado'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Iniciado em {test.startDate} • {test.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    {test.status === 'running' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Variants */}
                <div className="space-y-3">
                  {test.variants.map((variant, index) => (
                    <div key={index} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{variant.name}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{variant.visitors} visitantes</span>
                          <span className="text-muted-foreground">{variant.conversions} conversões</span>
                          <Badge variant="outline" className="font-mono">{variant.rate}%</Badge>
                        </div>
                      </div>
                      <Progress value={variant.rate * 10} className="h-2" />
                    </div>
                  ))}
                </div>

                {/* Results */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Uplift</p>
                      <p className="text-lg font-bold text-emerald-500">{test.uplift}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confiança</p>
                      <p className="text-lg font-bold text-foreground">{test.confidence}%</p>
                    </div>
                  </div>
                  {test.confidence >= 95 && (
                    <Button size="sm" className="gap-2">
                      Declarar Vencedor
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completed Tests */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Testes Concluídos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedTests.map((test) => (
              <Card key={test.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{test.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{test.conclusion}</p>
                    </div>
                    <Badge className={test.implemented 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-muted text-muted-foreground'
                    }>
                      {test.implemented ? 'Implementado' : 'Não aplicado'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Vencedor: <span className="font-medium text-foreground">{test.winner}</span>
                    </span>
                    <Badge variant="outline" className="text-emerald-500">{test.uplift}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
