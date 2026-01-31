import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plug, 
  Search,
  Calendar,
  Video,
  MessageSquare,
  Wallet,
  FileSignature,
  Megaphone,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Settings
} from "lucide-react";

const integrations = [
  {
    id: 1,
    name: "Google Calendar",
    description: "Sincronização de agendas e eventos",
    category: "Produtividade",
    status: "Conectado",
    icon: Calendar,
    color: "bg-blue-500",
    lastSync: "Há 5 minutos"
  },
  {
    id: 2,
    name: "Google Meet",
    description: "Criação automática de links de reunião",
    category: "Produtividade",
    status: "Conectado",
    icon: Video,
    color: "bg-green-500",
    lastSync: "Há 10 minutos"
  },
  {
    id: 3,
    name: "WhatsApp Business",
    description: "Mensagens e conversas via WhatsApp",
    category: "Comunicação",
    status: "Conectado",
    icon: MessageSquare,
    color: "bg-emerald-500",
    lastSync: "Há 2 minutos"
  },
  {
    id: 4,
    name: "Stripe",
    description: "Processamento de pagamentos internacionais",
    category: "Pagamentos",
    status: "Conectado",
    icon: Wallet,
    color: "bg-purple-500",
    lastSync: "Há 1 hora"
  },
  {
    id: 5,
    name: "Asaas",
    description: "Cobranças e boletos no Brasil",
    category: "Pagamentos",
    status: "Desconectado",
    icon: Wallet,
    color: "bg-blue-600",
    lastSync: null
  },
  {
    id: 6,
    name: "Autentique",
    description: "Assinaturas eletrônicas de documentos",
    category: "Documentos",
    status: "Conectado",
    icon: FileSignature,
    color: "bg-teal-500",
    lastSync: "Há 30 minutos"
  },
  {
    id: 7,
    name: "Google Ads",
    description: "Campanhas de pesquisa e display",
    category: "Marketing",
    status: "Conectado",
    icon: Megaphone,
    color: "bg-amber-500",
    lastSync: "Há 4 horas"
  },
  {
    id: 8,
    name: "Meta Ads",
    description: "Anúncios no Facebook e Instagram",
    category: "Marketing",
    status: "Conectado",
    icon: Megaphone,
    color: "bg-blue-600",
    lastSync: "Há 2 horas"
  },
  {
    id: 9,
    name: "LinkedIn Ads",
    description: "Campanhas B2B no LinkedIn",
    category: "Marketing",
    status: "Desconectado",
    icon: Megaphone,
    color: "bg-blue-700",
    lastSync: null
  },
];

const categories = ["Todos", "Produtividade", "Comunicação", "Pagamentos", "Documentos", "Marketing"];

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(i => i.status === "Conectado").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Integrações</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integrações</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie conexões com plataformas externas.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {connectedCount} de {integrations.length} conectadas
          </Badge>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar integrações..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => {
            const Icon = integration.icon;
            const isConnected = integration.status === "Conectado";

            return (
              <Card 
                key={integration.id}
                className={`hover:border-primary/50 transition-colors ${
                  !isConnected ? "opacity-75" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${integration.color}/10 flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${integration.color.replace("bg-", "text-")}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        isConnected 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                          : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                      }
                    >
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {integration.description}
                  </p>
                  
                  {isConnected && integration.lastSync && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Última sincronização: {integration.lastSync}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {isConnected ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-3 w-3 mr-1" />
                          Configurar
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Conectar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredIntegrations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Plug className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma integração encontrada</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
