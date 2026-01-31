import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FileText,
  Edit,
  Eye,
  Copy,
  Trash2,
  CheckCircle
} from "lucide-react";

const templates = [
  {
    id: "1",
    name: "Contrato de Prestação de Serviços",
    type: "contract",
    products: ["Consultoria Premium", "Mentoria Individual"],
    autentiqueCompatible: true,
    lastUpdated: "2024-01-10",
  },
  {
    id: "2",
    name: "Termo de Confidencialidade (NDA)",
    type: "term",
    products: ["Todos"],
    autentiqueCompatible: true,
    lastUpdated: "2024-01-05",
  },
  {
    id: "3",
    name: "Anamnese Comercial",
    type: "form",
    products: ["Consultoria Premium"],
    autentiqueCompatible: false,
    lastUpdated: "2023-12-20",
  },
  {
    id: "4",
    name: "Briefing de Projeto",
    type: "form",
    products: ["Pacote Essencial"],
    autentiqueCompatible: false,
    lastUpdated: "2024-01-12",
  },
];

const variables = [
  { name: "{{nome_cliente}}", description: "Nome completo do cliente" },
  { name: "{{nome_consultor}}", description: "Nome do consultor responsável" },
  { name: "{{produto}}", description: "Nome do produto/serviço" },
  { name: "{{plano}}", description: "Plano selecionado" },
  { name: "{{valor}}", description: "Valor total formatado" },
  { name: "{{data_inicio}}", description: "Data de início do contrato" },
  { name: "{{data_fim}}", description: "Data de término do contrato" },
];

const sampleContent = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular, de um lado:

CONTRATANTE: {{nome_cliente}}, doravante denominado CONTRATANTE;

CONTRATADO: Empresa XYZ, representada por {{nome_consultor}}, doravante denominado CONTRATADO;

Resolvem celebrar o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições a seguir:

CLÁUSULA 1ª - DO OBJETO
O presente contrato tem por objeto a prestação de serviços de {{produto}}, conforme plano {{plano}}.

CLÁUSULA 2ª - DO VALOR
O valor total dos serviços é de {{valor}}, a ser pago conforme condições acordadas.

CLÁUSULA 3ª - DO PRAZO
O presente contrato terá início em {{data_inicio}} e término em {{data_fim}}.`;

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Templates de Documentos</h1>
            <p className="text-muted-foreground">
              Configure modelos de documentos com variáveis dinâmicas
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  {template.autentiqueCompatible && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      Autentique
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Produtos associados:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.products.map((product) => (
                      <Badge key={product} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Atualizado em {new Date(template.lastUpdated).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Variables Reference */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Variáveis Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {variables.map((variable) => (
                <div key={variable.name} className="p-3 bg-muted rounded-lg">
                  <code className="text-sm text-primary font-mono">{variable.name}</code>
                  <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Editor Sheet */}
      <Sheet open={!!selectedTemplate || isCreating} onOpenChange={() => { setSelectedTemplate(null); setIsCreating(false); }}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isCreating ? "Novo Template" : "Editar Template"}</SheetTitle>
            <SheetDescription>
              Configure o modelo de documento com variáveis dinâmicas
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="editor" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nome do Template</Label>
                <Input 
                  defaultValue={selectedTemplate?.name || ""} 
                  placeholder="Ex: Contrato de Prestação de Serviços"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Select defaultValue={selectedTemplate?.type || "contract"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contrato</SelectItem>
                    <SelectItem value="term">Termo</SelectItem>
                    <SelectItem value="form">Formulário</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Conteúdo do Documento</Label>
                <Textarea 
                  defaultValue={sampleContent}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Digite o conteúdo do documento..."
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Compatível com Autentique para assinatura digital</span>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {sampleContent
                        .replace("{{nome_cliente}}", "Maria Santos")
                        .replace("{{nome_consultor}}", "João Silva")
                        .replace("{{produto}}", "Consultoria Premium")
                        .replace("{{plano}}", "Plano Anual")
                        .replace("{{valor}}", "R$ 18.000,00")
                        .replace("{{data_inicio}}", "01/02/2024")
                        .replace("{{data_fim}}", "01/02/2025")
                      }
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 mt-6">
            <Button className="flex-1">Salvar Template</Button>
            <Button variant="outline" onClick={() => { setSelectedTemplate(null); setIsCreating(false); }}>
              Cancelar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
