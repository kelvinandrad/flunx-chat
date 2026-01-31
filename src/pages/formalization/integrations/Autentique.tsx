import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle,
  RefreshCw,
  FileText,
  Settings,
  ExternalLink,
  Clock
} from "lucide-react";

const syncedTemplates = [
  { name: "Contrato de Prestação de Serviços", status: "synced", lastSync: "2024-01-20" },
  { name: "Termo de Confidencialidade (NDA)", status: "synced", lastSync: "2024-01-20" },
  { name: "Anamnese Comercial", status: "pending", lastSync: null },
];

const recentLogs = [
  { action: "Documento enviado", document: "Contrato - Maria Santos", time: "5 min atrás", status: "success" },
  { action: "Assinatura confirmada", document: "NDA - João Silva", time: "1h atrás", status: "success" },
  { action: "Documento enviado", document: "Contrato - Ana Costa", time: "2h atrás", status: "success" },
  { action: "Falha ao enviar", document: "Briefing - Carlos Mendes", time: "3h atrás", status: "error" },
];

export default function AutentiqueIntegration() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integração Autentique</h1>
            <p className="text-muted-foreground">
              Gerencie a integração com assinatura digital
            </p>
          </div>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Autentique
          </Button>
        </div>

        {/* Connection Status */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Autentique</h3>
                  <p className="text-muted-foreground">Assinatura digital de documentos</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="gap-1 px-3 py-1">
                  <CheckCircle className="h-4 w-4" />
                  Conectado
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Synced Templates */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Templates Sincronizados</CardTitle>
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncedTemplates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {template.status === "synced" ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs text-muted-foreground">
                            Sincronizado em {new Date(template.lastSync!).toLocaleDateString("pt-BR")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span className="text-xs text-muted-foreground">Pendente</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Logs Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    {log.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.document}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Documentos Enviados (Mês)</p>
              <p className="text-2xl font-bold mt-1">127</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Taxa de Assinatura</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">94%</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Tempo Médio de Assinatura</p>
              <p className="text-2xl font-bold mt-1">1.8 dias</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
