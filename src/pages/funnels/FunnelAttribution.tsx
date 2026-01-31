import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Crosshair,
  GitBranch,
  Share2,
  Info,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelAttribution {
  channel: string;
  firstTouch: number;
  lastTouch: number;
  linear: number;
  revenue: string;
  conversions: number;
}

const attributionData: ChannelAttribution[] = [
  { channel: "Google Ads", firstTouch: 35, lastTouch: 22, linear: 28, revenue: "R$ 180.000", conversions: 45 },
  { channel: "Facebook Ads", firstTouch: 25, lastTouch: 18, linear: 21, revenue: "R$ 120.000", conversions: 32 },
  { channel: "Email Marketing", firstTouch: 8, lastTouch: 28, linear: 18, revenue: "R$ 95.000", conversions: 28 },
  { channel: "Orgânico", firstTouch: 20, lastTouch: 15, linear: 17, revenue: "R$ 85.000", conversions: 22 },
  { channel: "Indicação", firstTouch: 7, lastTouch: 12, linear: 10, revenue: "R$ 65.000", conversions: 18 },
  { channel: "LinkedIn Ads", firstTouch: 5, lastTouch: 5, linear: 6, revenue: "R$ 35.000", conversions: 8 },
];

const attributionModels = [
  {
    id: "first-touch",
    name: "First Touch",
    icon: Target,
    description: "100% do crédito vai para o primeiro ponto de contato",
    pros: ["Identifica canais de descoberta", "Simples de entender", "Bom para awareness"],
    cons: ["Ignora jornada completa", "Subestima conversão"],
  },
  {
    id: "last-touch",
    name: "Last Touch",
    icon: Crosshair,
    description: "100% do crédito vai para o último ponto antes da conversão",
    pros: ["Foca na conversão direta", "Fácil de implementar", "Bom para vendas diretas"],
    cons: ["Ignora nurturing", "Subestima awareness"],
  },
  {
    id: "linear",
    name: "Linear",
    icon: Share2,
    description: "Crédito dividido igualmente entre todos os touchpoints",
    pros: ["Considera toda jornada", "Mais justo para canais", "Visão holística"],
    cons: ["Não diferencia impacto", "Pode diluir insights"],
  },
];

export default function FunnelAttribution() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Atribuição por Funil</h1>
            <p className="text-muted-foreground mt-1">
              Entenda quais canais contribuem para suas conversões
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="acquisition">
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecionar funil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acquisition">Funil de Aquisição</SelectItem>
                <SelectItem value="onboarding">Funil de Onboarding</SelectItem>
                <SelectItem value="upsell">Funil de Upsell</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30d">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Educational Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">O que é Atribuição?</h3>
                <p className="text-sm text-muted-foreground">
                  Atribuição é o processo de identificar quais canais de marketing e touchpoints 
                  contribuíram para uma conversão. Isso ajuda a entender o ROI real de cada canal 
                  e otimizar seus investimentos de marketing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attribution Models */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">Modelos de Atribuição</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {attributionModels.map((model) => {
              const Icon = model.icon;
              return (
                <Card key={model.id} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{model.name}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-green-500 mb-1">Vantagens</p>
                      <ul className="space-y-1">
                        {model.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-amber-500 mb-1">Limitações</p>
                      <ul className="space-y-1">
                        {model.cons.map((con, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-amber-500" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Attribution Comparison */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Comparativo de Atribuição por Canal</CardTitle>
            <CardDescription>
              Veja como cada modelo de atribuição distribui o crédito entre os canais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="comparison">Comparativo</TabsTrigger>
                <TabsTrigger value="first-touch">First Touch</TabsTrigger>
                <TabsTrigger value="last-touch">Last Touch</TabsTrigger>
                <TabsTrigger value="linear">Linear</TabsTrigger>
              </TabsList>

              <TabsContent value="comparison">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Canal</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">First Touch</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Last Touch</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Linear</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Receita</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversões</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attributionData.map((row) => (
                        <tr key={row.channel} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-foreground">{row.channel}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${row.firstTouch}px` }} />
                              <span className="text-sm text-foreground">{row.firstTouch}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-2 bg-green-500 rounded-full" style={{ width: `${row.lastTouch}px` }} />
                              <span className="text-sm text-foreground">{row.lastTouch}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-2 bg-primary rounded-full" style={{ width: `${row.linear}px` }} />
                              <span className="text-sm text-foreground">{row.linear}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-medium text-foreground">{row.revenue}</td>
                          <td className="py-3 px-4 text-right text-sm text-foreground">{row.conversions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="first-touch">
                <div className="space-y-4">
                  {attributionData.sort((a, b) => b.firstTouch - a.firstTouch).map((row) => (
                    <div key={row.channel} className="flex items-center gap-4">
                      <div className="w-32 flex-shrink-0">
                        <span className="text-sm text-foreground">{row.channel}</span>
                      </div>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-lg flex items-center justify-end pr-2"
                          style={{ width: `${row.firstTouch}%` }}
                        >
                          <span className="text-xs font-medium text-white">{row.firstTouch}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="last-touch">
                <div className="space-y-4">
                  {attributionData.sort((a, b) => b.lastTouch - a.lastTouch).map((row) => (
                    <div key={row.channel} className="flex items-center gap-4">
                      <div className="w-32 flex-shrink-0">
                        <span className="text-sm text-foreground">{row.channel}</span>
                      </div>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-lg flex items-center justify-end pr-2"
                          style={{ width: `${row.lastTouch}%` }}
                        >
                          <span className="text-xs font-medium text-white">{row.lastTouch}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="linear">
                <div className="space-y-4">
                  {attributionData.sort((a, b) => b.linear - a.linear).map((row) => (
                    <div key={row.channel} className="flex items-center gap-4">
                      <div className="w-32 flex-shrink-0">
                        <span className="text-sm text-foreground">{row.channel}</span>
                      </div>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-lg flex items-center justify-end pr-2"
                          style={{ width: `${row.linear}%` }}
                        >
                          <span className="text-xs font-medium text-white">{row.linear}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">6</p>
                  <p className="text-sm text-muted-foreground">Canais Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">153</p>
                  <p className="text-sm text-muted-foreground">Conversões Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">R$ 580k</p>
                  <p className="text-sm text-muted-foreground">Receita Atribuída</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">3.2</p>
                  <p className="text-sm text-muted-foreground">Touchpoints Médios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
