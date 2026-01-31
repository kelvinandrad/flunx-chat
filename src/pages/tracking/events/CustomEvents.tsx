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
import { Plus, Search, MoreHorizontal, Zap } from "lucide-react";

const customEvents = [
  {
    id: 1,
    name: "Download E-book",
    key: "download_ebook",
    type: "conversion",
    origin: "Website",
    peopleImpacted: 2456,
    lastTriggered: "Há 15 minutos",
    status: "active",
  },
  {
    id: 2,
    name: "Assistiu Vídeo 50%",
    key: "video_watched_50",
    type: "engagement",
    origin: "Website",
    peopleImpacted: 1890,
    lastTriggered: "Há 8 minutos",
    status: "active",
  },
  {
    id: 3,
    name: "Clicou Botão Preços",
    key: "click_pricing",
    type: "engagement",
    origin: "Website",
    peopleImpacted: 3421,
    lastTriggered: "Há 3 minutos",
    status: "active",
  },
  {
    id: 4,
    name: "Formulário Demo",
    key: "form_demo_submitted",
    type: "conversion",
    origin: "Website",
    peopleImpacted: 567,
    lastTriggered: "Há 1 hora",
    status: "active",
  },
  {
    id: 5,
    name: "Scroll 75% Página",
    key: "scroll_75_percent",
    type: "engagement",
    origin: "Website",
    peopleImpacted: 4521,
    lastTriggered: "Há 1 minuto",
    status: "active",
  },
  {
    id: 6,
    name: "Adicionou ao Carrinho",
    key: "add_to_cart",
    type: "conversion",
    origin: "E-commerce",
    peopleImpacted: 1234,
    lastTriggered: "Há 5 minutos",
    status: "active",
  },
  {
    id: 7,
    name: "Compartilhou Conteúdo",
    key: "content_shared",
    type: "engagement",
    origin: "Website",
    peopleImpacted: 342,
    lastTriggered: "Há 2 horas",
    status: "paused",
  },
  {
    id: 8,
    name: "Iniciou Checkout",
    key: "checkout_started",
    type: "conversion",
    origin: "E-commerce",
    peopleImpacted: 890,
    lastTriggered: "Há 12 minutos",
    status: "active",
  },
];

const typeConfig = {
  conversion: { label: "Conversão", color: "bg-success/10 text-success" },
  engagement: { label: "Engajamento", color: "bg-primary/10 text-primary" },
};

export default function CustomEvents() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Eventos Customizados
            </h1>
            <p className="text-sm text-muted-foreground">
              Eventos personalizados criados para seu negócio
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Evento
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar eventos..." className="pl-9" />
              </div>

              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="conversion">Conversão</SelectItem>
                    <SelectItem value="engagement">Engajamento</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {customEvents.length} eventos customizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Origem
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Pessoas Impactadas
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Último Disparo
                    </th>
                    <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customEvents.map((event) => {
                    const typeInfo =
                      typeConfig[event.type as keyof typeof typeConfig];
                    return (
                      <tr
                        key={event.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                              <Zap className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {event.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <code className="bg-muted px-1 py-0.5 rounded">
                                  {event.key}
                                </code>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant="secondary" className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-muted-foreground">
                            {event.origin}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-foreground">
                            {event.peopleImpacted.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-muted-foreground">
                            {event.lastTriggered}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <Badge
                            variant={
                              event.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              event.status === "active"
                                ? "bg-success/10 text-success hover:bg-success/20"
                                : ""
                            }
                          >
                            {event.status === "active" ? "Ativo" : "Pausado"}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
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
