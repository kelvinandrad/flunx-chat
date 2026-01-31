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
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const suggestedKeywords = [
  {
    id: 1,
    keyword: "software de vendas",
    volume: 12400,
    competition: "high",
    cpc: "R$ 8.45",
    trend: "up",
    added: false,
  },
  {
    id: 2,
    keyword: "crm para empresas",
    volume: 8900,
    competition: "high",
    cpc: "R$ 12.30",
    trend: "up",
    added: true,
  },
  {
    id: 3,
    keyword: "automação de marketing",
    volume: 6700,
    competition: "medium",
    cpc: "R$ 6.80",
    trend: "up",
    added: false,
  },
  {
    id: 4,
    keyword: "gestão de leads",
    volume: 4500,
    competition: "medium",
    cpc: "R$ 5.20",
    trend: "neutral",
    added: false,
  },
  {
    id: 5,
    keyword: "funil de vendas",
    volume: 9800,
    competition: "high",
    cpc: "R$ 7.90",
    trend: "up",
    added: true,
  },
  {
    id: 6,
    keyword: "sistema de atendimento",
    volume: 3200,
    competition: "low",
    cpc: "R$ 3.40",
    trend: "down",
    added: false,
  },
  {
    id: 7,
    keyword: "plataforma saas",
    volume: 2100,
    competition: "low",
    cpc: "R$ 4.10",
    trend: "up",
    added: false,
  },
  {
    id: 8,
    keyword: "software de gestão comercial",
    volume: 5600,
    competition: "medium",
    cpc: "R$ 6.50",
    trend: "neutral",
    added: false,
  },
];

const competitionConfig = {
  high: { label: "Alta", color: "text-destructive bg-destructive/10" },
  medium: { label: "Média", color: "text-warning bg-warning/10" },
  low: { label: "Baixa", color: "text-success bg-success/10" },
};

export default function Keywords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState(suggestedKeywords);

  const toggleKeyword = (id: number) => {
    setKeywords((prev) =>
      prev.map((kw) => (kw.id === id ? { ...kw, added: !kw.added } : kw))
    );
  };

  const addedCount = keywords.filter((kw) => kw.added).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Palavras-chave
            </h1>
            <p className="text-sm text-muted-foreground">
              Planejamento estratégico de palavras-chave
            </p>
          </div>

          {addedCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {addedCount} palavras no planejamento
            </Badge>
          )}
        </div>

        {/* Info Alert */}
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Estimativas ilustrativas baseadas em dados de mercado. Os valores
            reais podem variar.
          </AlertDescription>
        </Alert>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Pesquisar Palavras-chave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite uma palavra-chave ou termo de busca..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="br">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="br">Brasil</SelectItem>
                  <SelectItem value="pt">Portugal</SelectItem>
                  <SelectItem value="us">Estados Unidos</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Sugestões de Palavras-chave
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select defaultValue="volume">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="cpc">CPC</SelectItem>
                  <SelectItem value="competition">Concorrência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Palavra-chave
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Volume Mensal
                    </th>
                    <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Concorrência
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      CPC Estimado
                    </th>
                    <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tendência
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {keywords.map((kw) => {
                    const competition =
                      competitionConfig[
                        kw.competition as keyof typeof competitionConfig
                      ];
                    return (
                      <tr
                        key={kw.id}
                        className={`hover:bg-muted/50 transition-colors ${
                          kw.added ? "bg-success/5" : ""
                        }`}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {kw.added && (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                            <span className="font-medium text-foreground">
                              {kw.keyword}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {kw.volume.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <Badge
                            variant="secondary"
                            className={competition.color}
                          >
                            {competition.label}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {kw.cpc}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          {kw.trend === "up" && (
                            <TrendingUp className="h-4 w-4 text-success mx-auto" />
                          )}
                          {kw.trend === "down" && (
                            <TrendingDown className="h-4 w-4 text-destructive mx-auto" />
                          )}
                          {kw.trend === "neutral" && (
                            <Minus className="h-4 w-4 text-muted-foreground mx-auto" />
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Button
                            variant={kw.added ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => toggleKeyword(kw.id)}
                            className="gap-2"
                          >
                            {kw.added ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Adicionada
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                Adicionar
                              </>
                            )}
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
