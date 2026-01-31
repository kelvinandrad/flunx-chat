import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  DollarSign,
  Image,
  Target,
  Zap,
  ArrowRight,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const insights = [
  {
    id: 1,
    type: "warning",
    severity: "high",
    title: "CPC acima da média",
    description:
      "A campanha 'Prospecção Lookalike' está com CPC 45% acima da média do mercado.",
    metric: "R$ 8.90 vs R$ 6.15",
    campaign: "Prospecção Lookalike",
    action: "Revisar segmentação",
  },
  {
    id: 2,
    type: "warning",
    severity: "medium",
    title: "Baixa taxa de conversão",
    description:
      "O grupo 'Display Awareness' está com taxa de conversão abaixo do esperado.",
    metric: "0.8% vs 2.5%",
    campaign: "Display Awareness Q4",
    action: "Otimizar criativos",
  },
  {
    id: 3,
    type: "success",
    severity: "low",
    title: "Performance excepcional",
    description:
      "A campanha de remarketing está superando as metas em 32%.",
    metric: "+32% acima da meta",
    campaign: "Remarketing Carrinho",
    action: "Aumentar orçamento",
  },
  {
    id: 4,
    type: "warning",
    severity: "medium",
    title: "Orçamento subutilizado",
    description:
      "O grupo 'Search Marca' está gastando apenas 45% do orçamento diário.",
    metric: "45% utilização",
    campaign: "Search - Termos de Marca",
    action: "Expandir palavras-chave",
  },
];

const recommendations = [
  {
    id: 1,
    icon: DollarSign,
    title: "Ajustar Orçamento",
    description:
      "Realocar R$ 500/dia da campanha Display para Remarketing pode aumentar conversões em ~15%.",
    impact: "+15% conversões",
    effort: "Baixo",
  },
  {
    id: 2,
    icon: Image,
    title: "Revisar Criativos",
    description:
      "Os criativos do grupo 'Lookalike' têm CTR 40% menor que a média. Recomendamos testar novas variações.",
    impact: "+40% CTR potencial",
    effort: "Médio",
  },
  {
    id: 3,
    icon: Target,
    title: "Refinar Segmentação",
    description:
      "Excluir audiências com idade 55+ pode reduzir CPA em até 25% sem perder volume significativo.",
    impact: "-25% CPA",
    effort: "Baixo",
  },
  {
    id: 4,
    icon: Zap,
    title: "Ativar Lances Automáticos",
    description:
      "Migrar para 'Maximizar Conversões' pode melhorar resultados em campanhas maduras.",
    impact: "+20% eficiência",
    effort: "Baixo",
  },
];

const severityConfig = {
  high: { color: "text-destructive bg-destructive/10", icon: AlertTriangle },
  medium: { color: "text-warning bg-warning/10", icon: AlertTriangle },
  low: { color: "text-success bg-success/10", icon: CheckCircle2 },
};

export default function AIOptimization() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              IA & Otimização
            </h1>
            <p className="text-sm text-muted-foreground">
              Insights e recomendações automáticas para suas campanhas
            </p>
          </div>

          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Analisar Campanhas
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Os insights e recomendações são gerados com base na análise de
            performance das suas campanhas. As sugestões são informativas e não
            executam ações automaticamente.
          </AlertDescription>
        </Alert>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Insights Detectados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight) => {
              const severity =
                severityConfig[insight.severity as keyof typeof severityConfig];
              const SeverityIcon = severity.icon;

              return (
                <div
                  key={insight.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-lg ${severity.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <SeverityIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.campaign}
                          </Badge>
                          <span className="text-xs font-medium text-primary">
                            {insight.metric}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        {insight.action}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recomendações de Otimização
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => {
              const Icon = rec.icon;

              return (
                <Card key={rec.id} className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">
                          {rec.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rec.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge className="bg-success/10 text-success hover:bg-success/20">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {rec.impact}
                          </Badge>
                          <Badge variant="outline">Esforço: {rec.effort}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Resumo de Saúde das Campanhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">Saudáveis</span>
                </div>
                <p className="text-3xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">
                  campanhas performando bem
                </p>
              </div>

              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="font-medium text-warning">Atenção</span>
                </div>
                <p className="text-3xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">
                  campanhas precisam ajustes
                </p>
              </div>

              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-destructive">Críticas</span>
                </div>
                <p className="text-3xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">
                  campanhas com problemas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
