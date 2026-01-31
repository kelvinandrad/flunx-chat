import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { NotificationsList } from "@/components/dashboard/NotificationsList";
import { Users, Target, TrendingUp, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Pessoas Ativas"
            value="2.847"
            change="+12.5% este mês"
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Oportunidades Abertas"
            value="156"
            change="+8 esta semana"
            changeType="positive"
            icon={Target}
          />
          <StatsCard
            title="Conversões do Mês"
            value="34"
            change="78% da meta"
            changeType="neutral"
            icon={TrendingUp}
          />
          <StatsCard
            title="Receita Estimada"
            value="R$ 284.500"
            change="+23.1% vs anterior"
            changeType="positive"
            icon={DollarSign}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ChartCard />
          </div>

          {/* Notifications - Takes 1 column */}
          <div className="lg:col-span-1">
            <NotificationsList />
          </div>

          {/* Recent Activity - Full width on large, 2 columns on extra large */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Quick Actions Placeholder */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-5 card-hover h-full">
              <h3 className="text-base font-semibold text-foreground mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-sm font-medium text-foreground border border-primary/10">
                  + Nova Oportunidade
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground">
                  + Adicionar Pessoa
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground">
                  + Agendar Reunião
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground">
                  + Iniciar Fluxo IA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
