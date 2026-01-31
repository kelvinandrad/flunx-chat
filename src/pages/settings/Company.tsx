import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  FileText, 
  MapPin, 
  Phone, 
  User,
  ChevronRight,
  Eye
} from "lucide-react";

export default function Company() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Empresa</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dados da Empresa</h1>
          <p className="text-muted-foreground mt-1">
            Informações institucionais e administrativas do tenant.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Dados Jurídicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Dados Jurídicos
              </CardTitle>
              <CardDescription>
                Informações legais e fiscais da empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="razao-social">Razão Social</Label>
                <Input 
                  id="razao-social" 
                  defaultValue="Nexus Tecnologia LTDA"
                  placeholder="Nome completo da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome-fantasia">Nome Fantasia</Label>
                <Input 
                  id="nome-fantasia" 
                  defaultValue="Nexus"
                  placeholder="Nome comercial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documento (CNPJ)
                </Label>
                <Input 
                  id="documento" 
                  defaultValue="12.345.678/0001-90"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricao-estadual">Inscrição Estadual</Label>
                <Input 
                  id="inscricao-estadual" 
                  defaultValue="123.456.789.000"
                  placeholder="Inscrição estadual (se aplicável)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço Completo
              </CardTitle>
              <CardDescription>
                Endereço oficial da empresa para documentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input 
                    id="cep" 
                    defaultValue="01310-100"
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input 
                    id="estado" 
                    defaultValue="SP"
                    placeholder="UF"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input 
                  id="cidade" 
                  defaultValue="São Paulo"
                  placeholder="Nome da cidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Logradouro</Label>
                <Input 
                  id="endereco" 
                  defaultValue="Av. Paulista, 1000"
                  placeholder="Rua, Avenida, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input 
                    id="numero" 
                    defaultValue="1000"
                    placeholder="Nº"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input 
                    id="complemento" 
                    defaultValue="Sala 1501"
                    placeholder="Sala, Andar, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input 
                  id="bairro" 
                  defaultValue="Bela Vista"
                  placeholder="Nome do bairro"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contato Institucional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Contato Institucional
              </CardTitle>
              <CardDescription>
                Dados de contato oficial da empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-institucional">E-mail Institucional</Label>
                <Input 
                  id="email-institucional" 
                  type="email"
                  defaultValue="contato@nexus.com.br"
                  placeholder="email@empresa.com.br"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone Principal</Label>
                <Input 
                  id="telefone" 
                  defaultValue="(11) 3456-7890"
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Comercial</Label>
                <Input 
                  id="whatsapp" 
                  defaultValue="(11) 99999-9999"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  defaultValue="https://nexus.com.br"
                  placeholder="https://www.empresa.com.br"
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsável Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Responsável Legal
              </CardTitle>
              <CardDescription>
                Representante legal para contratos e documentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-responsavel">Nome Completo</Label>
                <Input 
                  id="nome-responsavel" 
                  defaultValue="João Silva Santos"
                  placeholder="Nome do responsável legal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf-responsavel">CPF</Label>
                <Input 
                  id="cpf-responsavel" 
                  defaultValue="123.456.789-00"
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo-responsavel">Cargo</Label>
                <Input 
                  id="cargo-responsavel" 
                  defaultValue="Diretor Executivo"
                  placeholder="Cargo na empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-responsavel">E-mail</Label>
                <Input 
                  id="email-responsavel" 
                  type="email"
                  defaultValue="joao.silva@nexus.com.br"
                  placeholder="email@empresa.com.br"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-primary" />
              Preview em Documentos
            </CardTitle>
            <CardDescription>
              Visualize como os dados aparecem em contratos e documentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 border border-dashed">
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Nexus Tecnologia LTDA</p>
                <p className="text-muted-foreground">CNPJ: 12.345.678/0001-90</p>
                <p className="text-muted-foreground">
                  Av. Paulista, 1000, Sala 1501 - Bela Vista
                </p>
                <p className="text-muted-foreground">
                  São Paulo - SP, 01310-100
                </p>
                <div className="pt-2 border-t mt-4">
                  <p className="text-muted-foreground">
                    Representado por: <span className="font-medium">João Silva Santos</span>
                  </p>
                  <p className="text-muted-foreground">
                    CPF: 123.456.789-00 - Diretor Executivo
                  </p>
                </div>
              </div>
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
