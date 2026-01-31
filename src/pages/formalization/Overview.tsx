import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileSignature, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  FileText,
  CheckCircle,
  Send,
  CreditCard
} from "lucide-react";

const kpis = [
  { label: "Processos Ativos", value: "47", icon: FileSignature, color: "text-primary" },
  { label: "Processos em Risco", value: "5", icon: AlertTriangle, color: "text-destructive" },
  { label: "Pagamentos Pendentes", value: "12", icon: Clock, color: "text-amber-500" },
  { label: "Receita Confirmada", value: "R$ 284.500", icon: DollarSign, color: "text-emerald-500" },
];

const statusData = [
  { status: "Rascunho", count: 8, color: "bg-muted" },
  { status: "Em Formalização", count: 15, color: "bg-blue-500" },
  { status: "Aguardando Pagamento", count: 12, color: "bg-amber-500" },
  { status: "Em Andamento", count: 18, color: "bg-primary" },
  { status: "Concluído", count: 89, color: "bg-emerald-500" },
  { status: "Em Risco", count: 5, color: "bg-destructive" },
  { status: "Cancelado", count: 3, color: "bg-muted-foreground" },
];

const recentTimeline = [
  { 
    type: "payment_confirmed", 
    description: "Pagamento confirmado - R$ 4.500", 
    person: "Maria Santos",
    time: "5 min atrás",
    icon: CheckCircle,
    color: "text-emerald-500"
  },
  { 
    type: "document_signed", 
    description: "Contrato assinado", 
    person: "João Silva",
    time: "15 min atrás",
    icon: FileSignature,
    color: "text-primary"
  },
  { 
    type: "document_sent", 
    description: "Documento enviado para assinatura", 
    person: "Ana Costa",
    time: "32 min atrás",
    icon: Send,
    color: "text-blue-500"
  },
  { 
    type: "charge_created", 
    description: "Cobrança criada - R$ 2.800", 
    person: "Carlos Mendes",
    time: "1h atrás",
    icon: CreditCard,
    color: "text-amber-500"
  },
  { 
    type: "document_created", 
    description: "Documento criado", 
    person: "Fernanda Lima",
    time: "2h atrás",
    icon: FileText,
    color: "text-muted-foreground"
  },
];

export default function FormalizationOverview() {
  const totalProcesses = statusData.reduce((acc, item) => acc + item.count, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Formalização & Receita</h1>
          <p className="text-muted-foreground">
            Visão geral de processos, documentos e cobranças
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusData.map((item) => (
                  <div key={item.status} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-48">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.status}</span>
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${(item.count / totalProcesses) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Timeline */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTimeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{item.person}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
