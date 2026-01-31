import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Link2Off,
  ExternalLink,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

const platforms = [
  {
    id: "google",
    name: "Google Ads",
    description: "Anúncios de pesquisa, display, YouTube e shopping",
    logo: "G",
    logoColor: "bg-blue-500",
    connected: true,
    accounts: [
      {
        id: "ga-001",
        name: "Conta Principal",
        accountId: "123-456-7890",
        status: "active",
        lastSync: "Há 5 minutos",
      },
      {
        id: "ga-002",
        name: "Conta Secundária",
        accountId: "987-654-3210",
        status: "active",
        lastSync: "Há 12 minutos",
      },
    ],
  },
  {
    id: "meta",
    name: "Meta Ads",
    description: "Anúncios para Facebook, Instagram e Messenger",
    logo: "M",
    logoColor: "bg-blue-600",
    connected: true,
    accounts: [
      {
        id: "ma-001",
        name: "Business Principal",
        accountId: "act_123456789",
        status: "active",
        lastSync: "Há 8 minutos",
      },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    description: "Anúncios B2B para profissionais e empresas",
    logo: "in",
    logoColor: "bg-sky-600",
    connected: false,
    accounts: [],
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    description: "Anúncios em vídeo para audiências jovens",
    logo: "T",
    logoColor: "bg-black",
    connected: false,
    accounts: [],
  },
  {
    id: "twitter",
    name: "X (Twitter) Ads",
    description: "Anúncios na rede social X",
    logo: "X",
    logoColor: "bg-neutral-800",
    connected: false,
    accounts: [],
  },
  {
    id: "pinterest",
    name: "Pinterest Ads",
    description: "Anúncios visuais para descoberta de produtos",
    logo: "P",
    logoColor: "bg-red-600",
    connected: false,
    accounts: [],
  },
];

export default function AccountsPlatforms() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Contas & Plataformas
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as conexões de anúncios do seu tenant
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Conectar Nova Conta
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Nota:</span> Cada
              tenant conecta suas próprias contas de anúncios. As credenciais
              são armazenadas de forma segura e isolada.
            </p>
          </CardContent>
        </Card>

        {/* Platforms Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => (
            <Card key={platform.id} className="card-hover overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-lg ${platform.logoColor} flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-lg">
                        {platform.logo}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium">
                        {platform.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {platform.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={platform.connected ? "default" : "secondary"}
                    className={
                      platform.connected
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : ""
                    }
                  >
                    {platform.connected ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Conectado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Desconectado
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {platform.connected && platform.accounts.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {platform.accounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {account.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {account.accountId}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {account.lastSync}
                            </span>
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-3.5 w-3.5" />
                        Adicionar Conta
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Link2Off className="h-3.5 w-3.5" />
                        Desconectar
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nenhuma conta conectada
                    </p>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      Conectar {platform.name}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Mais plataformas em breve: Microsoft Ads, Criteo, Taboola,
              Outbrain...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
