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
  Users,
  Target,
  RefreshCw,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";

const audiences = [
  {
    id: 1,
    name: "Visitantes do Site - 30 dias",
    type: "remarketing",
    platform: "Google Ads",
    size: 45000,
    status: "active",
    tags: ["website", "engajados"],
  },
  {
    id: 2,
    name: "Lookalike - Compradores 1%",
    type: "lookalike",
    platform: "Meta Ads",
    size: 1200000,
    status: "active",
    tags: ["expansão", "alta qualidade"],
  },
  {
    id: 3,
    name: "Interesse: Tecnologia B2B",
    type: "interest",
    platform: "Meta Ads",
    size: 8500000,
    status: "active",
    tags: ["prospecção", "b2b"],
  },
  {
    id: 4,
    name: "Carrinho Abandonado - 7 dias",
    type: "remarketing",
    platform: "Google Ads",
    size: 12000,
    status: "active",
    tags: ["conversão", "urgente"],
  },
  {
    id: 5,
    name: "Lookalike - Leads Qualificados 2%",
    type: "lookalike",
    platform: "Meta Ads",
    size: 2400000,
    status: "active",
    tags: ["expansão", "mid-funnel"],
  },
  {
    id: 6,
    name: "Interesse: Marketing Digital",
    type: "interest",
    platform: "Google Ads",
    size: 15000000,
    status: "paused",
    tags: ["awareness", "amplo"],
  },
  {
    id: 7,
    name: "Clientes Ativos",
    type: "remarketing",
    platform: "Meta Ads",
    size: 8500,
    status: "active",
    tags: ["retenção", "upsell"],
  },
  {
    id: 8,
    name: "Assistiram 75% do Vídeo",
    type: "remarketing",
    platform: "Meta Ads",
    size: 28000,
    status: "active",
    tags: ["engajados", "vídeo"],
  },
];

const typeConfig = {
  remarketing: {
    label: "Remarketing",
    icon: RefreshCw,
    color: "bg-blue-500/10 text-blue-500",
  },
  lookalike: {
    label: "Lookalike",
    icon: Sparkles,
    color: "bg-purple-500/10 text-purple-500",
  },
  interest: {
    label: "Interesse",
    icon: Target,
    color: "bg-orange-500/10 text-orange-500",
  },
};

export default function Audiences() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Públicos & Segmentações
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize e gerencie seus públicos de anúncio
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Público
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar públicos..." className="pl-9" />
              </div>

              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="remarketing">Remarketing</SelectItem>
                    <SelectItem value="lookalike">Lookalike</SelectItem>
                    <SelectItem value="interest">Interesse</SelectItem>
                  </SelectContent>
                </Select>

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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audiences Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => {
            const typeInfo = typeConfig[audience.type as keyof typeof typeConfig];
            const TypeIcon = typeInfo.icon;

            return (
              <Card key={audience.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${typeInfo.color} flex items-center justify-center`}
                      >
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {audience.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {audience.platform}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Tamanho
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {audience.size >= 1000000
                        ? `${(audience.size / 1000000).toFixed(1)}M`
                        : audience.size >= 1000
                        ? `${(audience.size / 1000).toFixed(0)}K`
                        : audience.size.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <Badge variant="secondary" className={typeInfo.color}>
                      {typeInfo.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        audience.status === "active" ? "default" : "secondary"
                      }
                      className={
                        audience.status === "active"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : ""
                      }
                    >
                      {audience.status === "active" ? "Ativo" : "Pausado"}
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1.5">
                      {audience.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
