import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Eye,
  Pause,
  Play,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Image,
  Video,
  Type,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const ads = [
  {
    id: 1,
    name: "Anúncio Texto - Desconto 50%",
    group: "Grupo - Termos Genéricos",
    type: "text",
    status: "active",
    impressions: 92000,
    clicks: 2450,
    ctr: 2.66,
    conversions: 68,
    cpa: "R$ 24.50",
    trend: "up",
    preview: {
      headline: "Black Friday - Até 50% OFF",
      description: "Aproveite os melhores descontos do ano. Frete grátis para todo Brasil.",
      url: "www.exemplo.com/blackfriday",
    },
  },
  {
    id: 2,
    name: "Anúncio Imagem - Banner Principal",
    group: "Grupo - Termos Genéricos",
    type: "image",
    status: "active",
    impressions: 156000,
    clicks: 3890,
    ctr: 2.49,
    conversions: 92,
    cpa: "R$ 28.90",
    trend: "up",
    preview: {
      imageUrl: "/placeholder.svg",
      headline: "Ofertas Imperdíveis",
    },
  },
  {
    id: 3,
    name: "Anúncio Vídeo - Institucional 15s",
    group: "Grupo - Termos de Marca",
    type: "video",
    status: "active",
    impressions: 78000,
    clicks: 1240,
    ctr: 1.59,
    conversions: 34,
    cpa: "R$ 45.20",
    trend: "down",
    preview: {
      videoThumbnail: "/placeholder.svg",
      duration: "0:15",
    },
  },
  {
    id: 4,
    name: "Anúncio Texto - Frete Grátis",
    group: "Grupo - Termos de Marca",
    type: "text",
    status: "paused",
    impressions: 34000,
    clicks: 890,
    ctr: 2.62,
    conversions: 28,
    cpa: "R$ 32.00",
    trend: "neutral",
    preview: {
      headline: "Frete Grátis em Tudo",
      description: "Compre agora e receba sem pagar nada pela entrega.",
      url: "www.exemplo.com/fretegratis",
    },
  },
  {
    id: 5,
    name: "Anúncio Carrossel - Produtos",
    group: "Grupo - Concorrentes",
    type: "image",
    status: "active",
    impressions: 112000,
    clicks: 2890,
    ctr: 2.58,
    conversions: 54,
    cpa: "R$ 38.50",
    trend: "up",
    preview: {
      imageUrl: "/placeholder.svg",
      headline: "Conheça nossos produtos",
    },
  },
];

const typeIcons = {
  text: Type,
  image: Image,
  video: Video,
};

const typeLabels = {
  text: "Texto",
  image: "Imagem",
  video: "Vídeo",
};

export default function AdsList() {
  const { campaignId, groupId } = useParams();
  const [selectedAd, setSelectedAd] = useState<(typeof ads)[0] | null>(null);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/trafego">Tráfego & Ads</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/trafego/campanhas">
                Campanhas
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/trafego/campanhas/${campaignId}/grupos`}
              >
                Black Friday 2024
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/trafego/campanhas/${campaignId}/grupos/${groupId}`}
              >
                Termos Genéricos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Anúncios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Anúncios</h1>
            <p className="text-sm text-muted-foreground">
              Grupo - Termos Genéricos • Campanha Black Friday 2024
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Anúncio
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar anúncios..." className="pl-9" />
              </div>

              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ads Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {ads.length} anúncios encontrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Anúncio
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
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
                  {ads.map((ad) => {
                    const TypeIcon = typeIcons[ad.type as keyof typeof typeIcons];
                    return (
                      <tr
                        key={ad.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {ad.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {ad.group}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline">
                            {typeLabels[ad.type as keyof typeof typeLabels]}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              ad.status === "active" ? "default" : "secondary"
                            }
                            className={
                              ad.status === "active"
                                ? "bg-success/10 text-success hover:bg-success/20"
                                : ""
                            }
                          >
                            {ad.status === "active" ? "Ativo" : "Pausado"}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {ad.impressions.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {ad.clicks.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="font-medium text-foreground">
                              {ad.ctr.toFixed(2)}%
                            </span>
                            {ad.trend === "up" && (
                              <TrendingUp className="h-3.5 w-3.5 text-success" />
                            )}
                            {ad.trend === "down" && (
                              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {ad.conversions.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-medium text-foreground">
                            {ad.cpa}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedAd(ad)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Preview do Anúncio</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                  {ad.type === "text" && (
                                    <div className="p-4 rounded-lg border border-border space-y-2">
                                      <p className="text-primary font-medium">
                                        {ad.preview.headline}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {ad.preview.description}
                                      </p>
                                      <p className="text-xs text-success">
                                        {ad.preview.url}
                                      </p>
                                    </div>
                                  )}
                                  {(ad.type === "image" ||
                                    ad.type === "video") && (
                                    <div className="space-y-3">
                                      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                                        {ad.type === "video" ? (
                                          <div className="text-center">
                                            <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <span className="text-xs text-muted-foreground">
                                              {ad.preview.duration}
                                            </span>
                                          </div>
                                        ) : (
                                          <Image className="h-8 w-8 text-muted-foreground" />
                                        )}
                                      </div>
                                      {ad.preview.headline && (
                                        <p className="text-sm font-medium text-center">
                                          {ad.preview.headline}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  <div className="space-y-4 pt-4 border-t border-border">
                                    <h4 className="font-medium">Métricas</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs text-muted-foreground">
                                          Impressões
                                        </p>
                                        <p className="text-lg font-semibold">
                                          {ad.impressions.toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs text-muted-foreground">
                                          Cliques
                                        </p>
                                        <p className="text-lg font-semibold">
                                          {ad.clicks.toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs text-muted-foreground">
                                          CTR
                                        </p>
                                        <p className="text-lg font-semibold">
                                          {ad.ctr.toFixed(2)}%
                                        </p>
                                      </div>
                                      <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs text-muted-foreground">
                                          CPA
                                        </p>
                                        <p className="text-lg font-semibold">
                                          {ad.cpa}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                            <Button variant="ghost" size="sm">
                              {ad.status === "active" ? (
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
