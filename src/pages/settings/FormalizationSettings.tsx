import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileSignature, 
  Wallet,
  Bot,
  FileText,
  Plug,
  ChevronRight
} from "lucide-react";

const variables = [
  { name: "{{nome_cliente}}", description: "Nome completo do cliente" },
  { name: "{{nome_empresa}}", description: "Nome da empresa do cliente" },
  { name: "{{nome_consultor}}", description: "Nome do responsável" },
  { name: "{{produto}}", description: "Nome do produto/serviço" },
  { name: "{{plano}}", description: "Nome do plano escolhido" },
  { name: "{{valor}}", description: "Valor total da proposta" },
  { name: "{{data_hoje}}", description: "Data atual" },
  { name: "{{data_vencimento}}", description: "Data de vencimento" },
];

const states = [
  { name: "Rascunho", color: "bg-gray-500" },
  { name: "Em formalização", color: "bg-blue-500" },
  { name: "Aguardando pagamento", color: "bg-amber-500" },
  { name: "Em andamento", color: "bg-purple-500" },
  { name: "Concluído", color: "bg-emerald-500" },
  { name: "Em risco", color: "bg-red-500" },
  { name: "Cancelado", color: "bg-gray-400" },
];

export default function FormalizationSettings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Formalização & Receita</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configurações de Formalização & Receita</h1>
          <p className="text-muted-foreground mt-1">
            Parâmetros para documentos, cobranças e processos administrativos.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Default Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Modelos Padrão de Documentos
              </CardTitle>
              <CardDescription>
                Templates usados automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template de Contrato Padrão</Label>
                <Select defaultValue="contrato-padrao">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contrato-padrao">Contrato Padrão v2.0</SelectItem>
                    <SelectItem value="contrato-consultoria">Contrato de Consultoria</SelectItem>
                    <SelectItem value="contrato-servicos">Contrato de Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Template de Proposta Comercial</Label>
                <Select defaultValue="proposta-padrao">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposta-padrao">Proposta Comercial v1.5</SelectItem>
                    <SelectItem value="proposta-enterprise">Proposta Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Template de Termo de Aceite</Label>
                <Select defaultValue="termo-padrao">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="termo-padrao">Termo de Aceite Padrão</SelectItem>
                    <SelectItem value="termo-servicos">Termo de Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Billing Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-primary" />
                Regras de Cobrança
              </CardTitle>
              <CardDescription>
                Configurações padrão para cobranças.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gateway Padrão</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="asaas">Asaas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prazo Padrão de Vencimento</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="5">5 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="10">10 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2 border-t pt-4">
                <div className="space-y-0.5">
                  <Label>Aplicar juros em atraso</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicionar 2% + 1% a.m. após vencimento
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Enviar lembretes automáticos</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar antes e após vencimento
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* AI Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-primary" />
                Permissões da IA
              </CardTitle>
              <CardDescription>
                O que a IA pode fazer automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode gerar documentos</Label>
                  <p className="text-sm text-muted-foreground">
                    Criar contratos a partir de templates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode enviar para assinatura</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar documentos via Autentique
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <Label>IA pode gerar cobranças</Label>
                  <p className="text-sm text-muted-foreground">
                    Criar links de pagamento
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>IA pode enviar lembretes de cobrança</Label>
                  <p className="text-sm text-muted-foreground">
                    Follow-ups de pagamento automáticos
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plug className="h-5 w-5 text-primary" />
                Integrações Padrão
              </CardTitle>
              <CardDescription>
                Plataformas conectadas para documentos e pagamentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <FileSignature className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">Autentique</p>
                    <p className="text-sm text-muted-foreground">Assinaturas eletrônicas</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">Pagamentos internacionais</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Asaas</p>
                    <p className="text-sm text-muted-foreground">Cobranças Brasil</p>
                  </div>
                </div>
                <Badge variant="outline">
                  Não conectado
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Variáveis Globais</CardTitle>
            <CardDescription>
              Variáveis disponíveis para uso em todos os templates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {variables.map((variable) => (
                <div 
                  key={variable.name}
                  className="p-3 border rounded-lg bg-muted/30"
                >
                  <code className="text-sm font-mono text-primary">{variable.name}</code>
                  <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin States */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estados Administrativos</CardTitle>
            <CardDescription>
              Estágios do ciclo de vida de um processo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {states.map((state) => (
                <div 
                  key={state.name}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg"
                >
                  <div className={`h-3 w-3 rounded-full ${state.color}`} />
                  <span className="text-sm font-medium">{state.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>Salvar Alterações</Button>
        </div>
      </div>
    </AppLayout>
  );
}
