import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  CheckCircle,
  Clock,
  MessageSquare,
  Mail,
  Bot,
  Edit,
  Copy,
  RefreshCw
} from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Confirmação Padrão",
    channel: "WhatsApp",
    timing: "24h antes",
    retries: 2,
    retryInterval: "4h",
    active: true,
    preview: "Olá {nome}! Lembrando da nossa reunião amanhã às {hora}. Confirma sua presença? Responda SIM para confirmar ou NÃO para reagendar.",
  },
  {
    id: 2,
    name: "Confirmação Formal",
    channel: "Email",
    timing: "48h antes",
    retries: 1,
    retryInterval: "24h",
    active: true,
    preview: "Prezado(a) {nome}, Gostaríamos de confirmar sua participação na reunião agendada para {data} às {hora}...",
  },
  {
    id: 3,
    name: "Lembrete Rápido",
    channel: "WhatsApp",
    timing: "2h antes",
    retries: 0,
    retryInterval: null,
    active: true,
    preview: "Oi {nome}! Só lembrando que nossa reunião começa em 2 horas. Segue o link: {link}",
  },
];

const windowOptions = [
  { label: "48h antes", value: "48h", recommended: false },
  { label: "24h antes", value: "24h", recommended: true },
  { label: "12h antes", value: "12h", recommended: false },
  { label: "2h antes", value: "2h", recommended: false },
];

export default function Confirmations() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Confirmações</h1>
            <p className="text-muted-foreground">Templates e configurações de confirmação automática</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmações Enviadas</p>
                  <p className="text-2xl font-bold text-foreground">324</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                  <p className="text-2xl font-bold text-emerald-500">78%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">No-shows Evitados</p>
                  <p className="text-2xl font-bold text-foreground">47</p>
                </div>
                <RefreshCw className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reagendamentos</p>
                  <p className="text-2xl font-bold text-foreground">23</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="timing">Janelas de Envio</TabsTrigger>
            <TabsTrigger value="retries">Regras de Retry</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            {template.channel === "WhatsApp" ? (
                              <MessageSquare className="h-5 w-5 text-primary" />
                            ) : (
                              <Mail className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{template.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{template.channel}</span>
                              <span>•</span>
                              <span>{template.timing}</span>
                              {template.retries > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{template.retries}x retry</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={template.active} />
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-sm text-muted-foreground italic">
                          "{template.preview}"
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{`{nome}`}</Badge>
                        <Badge variant="secondary">{`{data}`}</Badge>
                        <Badge variant="secondary">{`{hora}`}</Badge>
                        <Badge variant="secondary">{`{link}`}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="timing" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Janelas de Envio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configure quando as confirmações devem ser enviadas antes dos eventos.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {windowOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-4 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                          option.recommended ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{option.label}</span>
                          </div>
                          {option.recommended && (
                            <Badge className="bg-primary">Recomendado</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retries" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Regras de Retry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Configure quantas vezes e em que intervalo o sistema deve reenviar confirmações não respondidas.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Máximo de Retentativas</Label>
                      <Input type="number" defaultValue="2" className="w-24" />
                    </div>
                    <div className="space-y-2">
                      <Label>Intervalo entre Retentativas</Label>
                      <Input type="text" defaultValue="4 horas" className="w-32" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mensagem de Retry</Label>
                      <Textarea 
                        placeholder="Mensagem alternativa para retentativas..."
                        defaultValue="Oi {nome}, notei que não recebi sua confirmação. Podemos manter nossa reunião de {data}?"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                  <Bot className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-sm text-violet-700 dark:text-violet-300">
                    A IA pode adaptar a mensagem de retry baseada no contexto da conversa anterior.
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
