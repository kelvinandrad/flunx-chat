import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  MessageSquare,
  Plus,
  Mail,
  Phone,
  Building2,
  Calendar,
  User,
  Tag,
  Globe,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { usePerson } from "@/hooks/usePeople";
import { PersonFormDialog } from "@/components/people/PersonFormDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for tabs that depend on other modules (CRM, Communication, etc.)
const mockOpportunities = [
  {
    id: "1",
    title: "Plano Enterprise",
    value: "R$ 25.000",
    stage: "Negociação",
    probability: "75%",
  },
];

const mockConversations = [
  {
    id: "1",
    channel: "WhatsApp",
    agent: "Agente Comercial",
    lastMessage: "Olá, tudo bem? Vi que você...",
    time: "2h atrás",
  },
];

const mockTimeline = [
  {
    id: "1",
    type: "created",
    title: "Pessoa criada",
    description: "Entrada via sistema",
    time: "Recentemente",
    icon: User,
  },
];

const mockProducts = [
  {
    id: "1",
    name: "Plano Pro",
    type: "Assinatura",
    value: "R$ 299/mês",
    status: "Ativo",
    since: "Jan 2024",
  },
];

export default function PersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: person, isLoading, error } = usePerson(id);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error || !person) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-medium text-foreground">Pessoa não encontrada</p>
          <Button variant="outline" onClick={() => navigate("/pessoas")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Pessoas
          </Button>
        </div>
      </AppLayout>
    );
  }

  const tags = Array.isArray(person.tags) ? (person.tags as string[]) : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/pessoas")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Pessoas
        </Button>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={person.avatar_url || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(person.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{person.name}</h1>
              <p className="text-muted-foreground">{person.email || "Sem email"}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {person.status && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  >
                    {person.status}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-muted/50 text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setIsFormOpen(true)}>
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Atividade
            </Button>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Iniciar Conversa
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="contact">Contato & Identidade</TabsTrigger>
            <TabsTrigger value="crm">CRM & Oportunidades</TabsTrigger>
            <TabsTrigger value="communication">Comunicação</TabsTrigger>
            <TabsTrigger value="journey">Jornada & Eventos</TabsTrigger>
            <TabsTrigger value="revenue">Produtos & Receita</TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Dados Principais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Nome</p>
                      <p className="text-sm font-medium">{person.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{person.email || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="text-sm font-medium">{person.phone || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Empresa</p>
                      <p className="text-sm font-medium">{person.company || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tags & Origem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tags</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tags.length > 0 ? (
                          tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Origem</p>
                      <p className="text-sm font-medium">{person.origin || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Criado em</p>
                      <p className="text-sm font-medium">{formatDate(person.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Atualizado em</p>
                      <p className="text-sm font-medium">{formatDate(person.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Etapa Atual</p>
                      <Badge variant="outline" className="mt-1">
                        — (CRM não implementado)
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Responsável</p>
                      <p className="text-sm font-medium">— (CRM não implementado)</p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium text-emerald-600">{person.status || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Preview (placeholder) */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTimeline.slice(0, 3).map((event) => {
                    const Icon = event.icon;
                    return (
                      <div key={event.id} className="flex items-start gap-3">
                        <div className="rounded-full bg-muted p-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Contato & Identidade */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email Principal</p>
                        <p className="text-sm font-medium">{person.email || "—"}</p>
                      </div>
                    </div>
                    {person.email && <Badge variant="secondary">Principal</Badge>}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                        <p className="text-sm font-medium">{person.phone || "—"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">WhatsApp</p>
                        <p className="text-sm font-medium">{person.whatsapp || "—"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Documentos & Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">CPF/CNPJ</p>
                      <p className="text-sm font-medium">{person.document || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Empresa Vinculada</p>
                      <p className="text-sm font-medium">{person.company || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: CRM & Oportunidades (placeholder) */}
          <TabsContent value="crm" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Oportunidades Vinculadas</CardTitle>
                <Button size="sm" className="gap-2" disabled>
                  <Plus className="h-4 w-4" />
                  Nova Oportunidade
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">CRM será implementado na Camada 3</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Comunicação (placeholder) */}
          <TabsContent value="communication" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Conversas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">Comunicação será implementada em camadas futuras</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Jornada & Eventos (placeholder) */}
          <TabsContent value="journey" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Timeline de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">Jornada será implementada em camadas futuras</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Produtos & Receita (placeholder) */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Produtos Contratados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">Produtos & Receita será implementada em camadas futuras</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Form Dialog */}
      <PersonFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} person={person} />
    </AppLayout>
  );
}
