import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Phone,
  MessageSquare,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data
const mockOpportunity = {
  id: "1",
  name: "Contrato Enterprise",
  person: {
    id: "1",
    name: "João Silva",
    email: "joao.silva@empresa.com",
    phone: "+55 11 99999-9999",
    company: "Tech Solutions Ltda",
    avatar: null,
  },
  stage: "Proposta Enviada",
  value: 150000,
  probability: 70,
  owner: "Carlos Mendes",
  origin: "Inbound",
  product: "Plano Enterprise",
  funnel: "Vendas B2B",
  createdAt: "2024-01-10",
  expectedClose: "2024-02-15",
  lastUpdate: "2024-01-28",
  description: "Cliente interessado em migrar do plano atual para Enterprise com necessidade de customizações.",
};

const mockActivities = [
  {
    id: "1",
    type: "Tarefa",
    title: "Preparar proposta comercial",
    status: "Concluída",
    date: "2024-01-25",
    owner: "Carlos Mendes",
  },
  {
    id: "2",
    type: "Follow-up",
    title: "Acompanhar retorno da proposta",
    status: "Pendente",
    date: "2024-01-30",
    owner: "Carlos Mendes",
  },
  {
    id: "3",
    type: "Reunião",
    title: "Demo do produto",
    status: "Agendada",
    date: "2024-02-01",
    owner: "Ana Costa",
  },
];

const mockHistory = [
  {
    id: "1",
    type: "stage_change",
    from: "Qualificação",
    to: "Proposta Enviada",
    date: "2024-01-25",
    user: "Carlos Mendes",
  },
  {
    id: "2",
    type: "value_change",
    from: 120000,
    to: 150000,
    date: "2024-01-20",
    user: "Carlos Mendes",
  },
  {
    id: "3",
    type: "stage_change",
    from: "Descoberta",
    to: "Qualificação",
    date: "2024-01-15",
    user: "Ana Costa",
  },
];

const mockDocuments = [
  {
    id: "1",
    name: "Proposta Comercial - Enterprise.pdf",
    type: "Proposta",
    date: "2024-01-25",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Apresentação Institucional.pptx",
    type: "Apresentação",
    date: "2024-01-20",
    size: "5.1 MB",
  },
];

const stageColors: Record<string, string> = {
  "Descoberta": "bg-muted text-muted-foreground",
  "Qualificação": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Proposta Enviada": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Negociação": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Fechamento": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/comercial/oportunidades")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Oportunidades
        </Button>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <DollarSign className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{mockOpportunity.name}</h1>
                <Badge className={stageColors[mockOpportunity.stage] || ""}>
                  {mockOpportunity.stage}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <button
                  className="flex items-center gap-1 text-primary hover:underline"
                  onClick={() => navigate(`/pessoas/${mockOpportunity.person.id}`)}
                >
                  <User className="h-3.5 w-3.5" />
                  {mockOpportunity.person.name}
                </button>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {mockOpportunity.person.company}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Previsão: {new Date(mockOpportunity.expectedClose).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </Button>
            <Button size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Iniciar Conversa
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Estimado</p>
                  <p className="text-2xl font-semibold">{formatCurrency(mockOpportunity.value)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Probabilidade</p>
                  <p className="text-2xl font-semibold">{mockOpportunity.probability}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Ponderado</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency((mockOpportunity.value * mockOpportunity.probability) / 100)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dias em Aberto</p>
                  <p className="text-2xl font-semibold">18</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="communication">Comunicação</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Dados Principais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Origem</p>
                      <p className="font-medium">{mockOpportunity.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Produto/Oferta</p>
                      <p className="font-medium">{mockOpportunity.product}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Funil Operacional</p>
                      <p className="font-medium">{mockOpportunity.funnel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Responsável</p>
                      <p className="font-medium">{mockOpportunity.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Criada em</p>
                      <p className="font-medium">
                        {new Date(mockOpportunity.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Última Atualização</p>
                      <p className="font-medium">
                        {new Date(mockOpportunity.lastUpdate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="mt-1 text-sm">{mockOpportunity.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contato Vinculado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mockOpportunity.person.avatar || undefined} />
                      <AvatarFallback>
                        {mockOpportunity.person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{mockOpportunity.person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {mockOpportunity.person.company}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mockOpportunity.person.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{mockOpportunity.person.phone}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/pessoas/${mockOpportunity.person.id}`)}
                  >
                    Ver Perfil Completo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Atividades</CardTitle>
                <Button size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Nova Atividade
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            activity.status === "Concluída"
                              ? "bg-emerald-500/10"
                              : activity.status === "Pendente"
                              ? "bg-amber-500/10"
                              : "bg-blue-500/10"
                          }`}
                        >
                          {activity.status === "Concluída" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : activity.status === "Pendente" ? (
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type} • {activity.owner}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            activity.status === "Concluída"
                              ? "default"
                              : activity.status === "Pendente"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {activity.status}
                        </Badge>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico de Comunicação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-muted-foreground">
                    Nenhuma conversa registrada para esta oportunidade
                  </p>
                  <Button className="mt-4">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Iniciar Conversa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico de Alterações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistory.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            item.type === "stage_change"
                              ? "bg-blue-500/10"
                              : "bg-emerald-500/10"
                          }`}
                        >
                          {item.type === "stage_change" ? (
                            <ArrowUpRight className="h-4 w-4 text-blue-600" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="flex-1 w-px bg-border" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium">
                          {item.type === "stage_change"
                            ? `Etapa alterada de "${item.from}" para "${item.to}"`
                            : `Valor alterado de ${formatCurrency(item.from as number)} para ${formatCurrency(item.to as number)}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.user} •{" "}
                          {new Date(item.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Documentos</CardTitle>
                <Button size="sm" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
