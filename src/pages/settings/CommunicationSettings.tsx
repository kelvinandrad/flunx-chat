import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Settings,
  FileText,
  Clock,
  Mail,
  User,
  ChevronRight,
  Zap
} from "lucide-react";

export default function CommunicationSettings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Comunicação</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configurações de Comunicação</h1>
          <p className="text-muted-foreground mt-1">
            Parâmetros globais para canais, mensagens e automações.
          </p>
        </div>

        <Tabs defaultValue="channels">
          <TabsList>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Canais
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Regras
            </TabsTrigger>
            <TabsTrigger value="signature" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Identidade
            </TabsTrigger>
          </TabsList>

          {/* Channels Tab */}
          <TabsContent value="channels" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações Padrão de Canais</CardTitle>
                <CardDescription>
                  Defina comportamentos padrão para todos os canais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Confirmação de Leitura</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar confirmação quando mensagem for lida
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Indicador de Digitação</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar quando alguém está digitando
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label>Respostas Automáticas</Label>
                    <p className="text-sm text-muted-foreground">
                      Responder automaticamente fora do horário
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Horário de Atendimento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Início</Label>
                      <Input type="time" defaultValue="08:00" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Fim</Label>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Templates Globais</CardTitle>
                <CardDescription>
                  Mensagens padrão usadas em todo o sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mensagem de Boas-vindas</Label>
                  <Textarea 
                    defaultValue="Olá! 👋 Bem-vindo(a) à Nexus. Como posso ajudar você hoje?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem Fora do Horário</Label>
                  <Textarea 
                    defaultValue="Obrigado pelo contato! Nosso horário de atendimento é das 08h às 18h. Retornaremos assim que possível."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem de Encerramento</Label>
                  <Textarea 
                    defaultValue="Obrigado pelo contato! Se precisar de mais alguma coisa, estamos à disposição. Tenha um ótimo dia! 🙂"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem de Espera</Label>
                  <Textarea 
                    defaultValue="Aguarde um momento, estou verificando essa informação para você..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Buffer de Mensagens
                  </CardTitle>
                  <CardDescription>
                    Tempo de espera antes de enviar mensagens.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Delay entre mensagens</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sem delay</SelectItem>
                        <SelectItem value="1">1 segundo</SelectItem>
                        <SelectItem value="3">3 segundos</SelectItem>
                        <SelectItem value="5">5 segundos</SelectItem>
                        <SelectItem value="10">10 segundos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label>Agrupar mensagens rápidas</Label>
                      <p className="text-sm text-muted-foreground">
                        Combinar mensagens enviadas em sequência
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    Envio Fracionado
                  </CardTitle>
                  <CardDescription>
                    Evite enviar muitas mensagens de uma vez.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Máximo de mensagens por minuto</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 mensagens</SelectItem>
                        <SelectItem value="10">10 mensagens</SelectItem>
                        <SelectItem value="20">20 mensagens</SelectItem>
                        <SelectItem value="50">50 mensagens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label>Respeitar limites da plataforma</Label>
                      <p className="text-sm text-muted-foreground">
                        Adaptar envio aos limites de cada canal
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Signature Tab */}
          <TabsContent value="signature" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Identidade do Remetente
                </CardTitle>
                <CardDescription>
                  Como sua empresa aparece nas comunicações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Remetente</Label>
                  <Input defaultValue="Nexus" placeholder="Nome que aparece nas mensagens" />
                </div>

                <div className="space-y-2">
                  <Label>E-mail de Resposta</Label>
                  <Input type="email" defaultValue="contato@nexus.com.br" placeholder="email@empresa.com" />
                </div>

                <div className="space-y-2">
                  <Label>Assinatura Automática (E-mail)</Label>
                  <Textarea 
                    defaultValue="--
Nexus | Transformando vendas com inteligência
www.nexus.com.br | (11) 3456-7890"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Incluir assinatura automaticamente</Label>
                    <p className="text-sm text-muted-foreground">
                      Adicionar assinatura em todos os e-mails
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>Salvar Alterações</Button>
        </div>
      </div>
    </AppLayout>
  );
}
