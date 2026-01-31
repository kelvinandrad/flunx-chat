import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Image, 
  Type,
  ChevronRight,
  Upload,
  Monitor,
  MessageSquare,
  Globe,
  Sun,
  Moon
} from "lucide-react";

export default function Branding() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Configurações</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Identidade Visual</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Identidade Visual</h1>
          <p className="text-muted-foreground mt-1">
            Personalize a marca e aparência do seu sistema.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Logo Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Image className="h-5 w-5 text-primary" />
                Logo Principal
              </CardTitle>
              <CardDescription>
                Logo usado no sistema, e-mails e documentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-muted/30">
                <div className="h-16 w-48 bg-muted rounded flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">N</span>
                    </div>
                    <span className="font-semibold text-xl">Nexus</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="ghost" size="sm">Remover</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, SVG ou JPG. Máximo 2MB. Recomendado: 200x50px
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Logo Alternativa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex gap-1">
                  <Sun className="h-4 w-4 text-primary" />
                  <Moon className="h-4 w-4 text-primary" />
                </div>
                Logo Alternativa
              </CardTitle>
              <CardDescription>
                Versão para fundos escuros/claros contrastantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-background">
                  <div className="h-12 w-32 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Tema Claro</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-sidebar">
                  <div className="h-12 w-32 bg-sidebar-accent rounded flex items-center justify-center">
                    <span className="text-xs text-sidebar-foreground/60">Tema Escuro</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-sidebar-foreground">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="h-5 w-5 text-primary" />
                Cores da Marca
              </CardTitle>
              <CardDescription>
                Defina as cores primárias e secundárias.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cor Primária</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-md bg-primary border cursor-pointer" />
                  <Input defaultValue="#8B5CF6" className="flex-1 font-mono text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor Secundária</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-md bg-secondary border cursor-pointer" />
                  <Input defaultValue="#F1F0FB" className="flex-1 font-mono text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor de Destaque</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-md bg-accent border cursor-pointer" />
                  <Input defaultValue="#F1F0FB" className="flex-1 font-mono text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-xs text-muted-foreground">Paleta Atual</Label>
                <div className="flex gap-1 mt-2">
                  <div className="h-8 w-8 rounded bg-primary" title="Primary" />
                  <div className="h-8 w-8 rounded bg-secondary" title="Secondary" />
                  <div className="h-8 w-8 rounded bg-accent" title="Accent" />
                  <div className="h-8 w-8 rounded bg-muted" title="Muted" />
                  <div className="h-8 w-8 rounded bg-destructive" title="Destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipografia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Type className="h-5 w-5 text-primary" />
                Tipografia
              </CardTitle>
              <CardDescription>
                Família de fontes do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fonte Principal</Label>
                <Select defaultValue="inter">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="poppins">Poppins</SelectItem>
                    <SelectItem value="open-sans">Open Sans</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-xs text-muted-foreground mb-3 block">Preview</Label>
                <div className="space-y-2">
                  <p className="text-2xl font-semibold">Título Principal</p>
                  <p className="text-lg font-medium">Subtítulo da Página</p>
                  <p className="text-base">Texto de parágrafo normal com informações.</p>
                  <p className="text-sm text-muted-foreground">Texto secundário com detalhes.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ícone da Marca */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Image className="h-5 w-5 text-primary" />
                Ícone da Marca
              </CardTitle>
              <CardDescription>
                Favicon e ícone para aplicativos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-2xl">N</span>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Ícone
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG ou ICO. 512x512px recomendado.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-xs text-muted-foreground mb-3 block">Tamanhos</Label>
                <div className="flex items-end gap-3">
                  <div className="h-4 w-4 rounded bg-primary" title="16x16" />
                  <div className="h-6 w-6 rounded bg-primary" title="32x32" />
                  <div className="h-8 w-8 rounded bg-primary" title="48x48" />
                  <div className="h-12 w-12 rounded bg-primary" title="64x64" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Preview da Identidade Visual
            </CardTitle>
            <CardDescription>
              Visualize como sua marca aparece em diferentes contextos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sistema">
              <TabsList>
                <TabsTrigger value="sistema" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Sistema
                </TabsTrigger>
                <TabsTrigger value="mensagens" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mensagens
                </TabsTrigger>
                <TabsTrigger value="publico" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Páginas Públicas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sistema" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="h-12 bg-sidebar flex items-center px-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">N</span>
                      </div>
                      <span className="font-semibold text-sidebar-foreground">Nexus</span>
                    </div>
                  </div>
                  <div className="h-32 bg-background p-4">
                    <div className="text-sm text-muted-foreground">
                      Preview do sistema com sua identidade visual aplicada.
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mensagens" className="mt-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">N</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Nexus</p>
                      <div className="bg-background rounded-lg p-3 shadow-sm">
                        <p className="text-sm">
                          Olá! Como posso ajudar você hoje?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="publico" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="h-16 bg-primary flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold">N</span>
                      </div>
                      <span className="font-semibold text-white text-lg">Nexus</span>
                    </div>
                  </div>
                  <div className="h-24 bg-background p-4 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Sua página de agendamento público
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
