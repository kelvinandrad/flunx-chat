import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loader2 } from "lucide-react";
// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CreateOrganization from "./pages/auth/CreateOrganization";
// App Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PeopleManagement from "./pages/people/PeopleManagement";
import PersonDetails from "./pages/people/PersonDetails";
import ProfilesIdentities from "./pages/people/ProfilesIdentities";
import HistoryJourney from "./pages/people/HistoryJourney";
import Opportunities from "./pages/crm/Opportunities";
import OpportunityDetails from "./pages/crm/OpportunityDetails";
import Pipeline from "./pages/crm/Pipeline";
import Activities from "./pages/crm/Activities";
import Salespeople from "./pages/crm/Salespeople";
import FunnelsList from "./pages/funnels/FunnelsList";
import FunnelEditor from "./pages/funnels/FunnelEditor";
import Journeys from "./pages/funnels/Journeys";
import BottleneckAnalysis from "./pages/funnels/BottleneckAnalysis";
import FunnelAttribution from "./pages/funnels/FunnelAttribution";
// Communication Module
import CommunicationOverview from "./pages/communication/Overview";
import AgentsList from "./pages/communication/agents/AgentsList";
import AgentEditor from "./pages/communication/agents/AgentEditor";
import Orchestrator from "./pages/communication/agents/Orchestrator";
import FlowsList from "./pages/communication/flows/FlowsList";
import FlowEditor from "./pages/communication/flows/FlowEditor";
import ChannelsList from "./pages/communication/channels/ChannelsList";
import ChannelConfig from "./pages/communication/channels/ChannelConfig";
import Conversations from "./pages/communication/Conversations";
import CommunicationPerformance from "./pages/communication/Performance";
// Products & Offers Module
import ProductsList from "./pages/products/catalog/ProductsList";
import ProductEditor from "./pages/products/catalog/ProductEditor";
import ServicesList from "./pages/products/catalog/ServicesList";
import ServiceEditor from "./pages/products/catalog/ServiceEditor";
import OffersList from "./pages/products/offers/OffersList";
import OfferEditor from "./pages/products/offers/OfferEditor";
import OffersArchived from "./pages/products/offers/OffersArchived";
import Plans from "./pages/products/pricing/Plans";
import PaymentConditions from "./pages/products/pricing/PaymentConditions";
import Bundles from "./pages/products/Bundles";
import FunnelIntegration from "./pages/products/integrations/FunnelIntegration";
import AIIntegration from "./pages/products/integrations/AIIntegration";
import AdsIntegration from "./pages/products/integrations/AdsIntegration";
import ProductsPerformance from "./pages/products/performance/Overview";
import ABTests from "./pages/products/performance/ABTests";
// Traffic & Ads Module
import TrafficOverview from "./pages/traffic/Overview";
import AccountsPlatforms from "./pages/traffic/AccountsPlatforms";
import CampaignsList from "./pages/traffic/campaigns/CampaignsList";
import AdGroups from "./pages/traffic/campaigns/AdGroups";
import AdsList from "./pages/traffic/campaigns/AdsList";
import Keywords from "./pages/traffic/planning/Keywords";
import Audiences from "./pages/traffic/planning/Audiences";
import BudgetProjections from "./pages/traffic/planning/BudgetProjections";
import AIOptimization from "./pages/traffic/AIOptimization";
// Tracking & Attribution Module
import TrackingOverview from "./pages/tracking/Overview";
import SourcesChannels from "./pages/tracking/sources/SourcesChannels";
import TrackingCampaigns from "./pages/tracking/sources/Campaigns";
import UTMGenerator from "./pages/tracking/sources/UTMGenerator";
import StandardEvents from "./pages/tracking/events/StandardEvents";
import CustomEvents from "./pages/tracking/events/CustomEvents";
import EventTimeline from "./pages/tracking/events/Timeline";
import PeopleJourneys from "./pages/tracking/journeys/PeopleJourneys";
import FunnelJourneys from "./pages/tracking/journeys/FunnelJourneys";
import PathAnalysis from "./pages/tracking/journeys/PathAnalysis";
import AttributionModels from "./pages/tracking/attribution/AttributionModels";
import ModelComparison from "./pages/tracking/attribution/ModelComparison";
import RevenueConversions from "./pages/tracking/attribution/RevenueConversions";
import {
  PerformanceByChannel,
  PerformanceByCampaign,
  PerformanceByOffer,
  PerformanceByAgent,
} from "./pages/tracking/performance/Performance";
// Scheduling Module
import SchedulingOverview from "./pages/scheduling/Overview";
import AllEvents from "./pages/scheduling/events/AllEvents";
import Followups from "./pages/scheduling/events/Followups";
import Meetings from "./pages/scheduling/events/Meetings";
import Deadlines from "./pages/scheduling/events/Deadlines";
import CalendarView from "./pages/scheduling/calendar/CalendarView";
import NextSteps from "./pages/scheduling/NextSteps";
import FollowupRules from "./pages/scheduling/automation/FollowupRules";
import Confirmations from "./pages/scheduling/automation/Confirmations";
import Reminders from "./pages/scheduling/automation/Reminders";
import SchedulingAgendas from "./pages/scheduling/resources/Agendas";
import Locations from "./pages/scheduling/resources/Locations";
import EventTypes from "./pages/scheduling/resources/EventTypes";
import GoogleCalendar from "./pages/scheduling/integrations/GoogleCalendar";
import GoogleMeet from "./pages/scheduling/integrations/GoogleMeet";
// Formalization & Revenue Module
import FormalizationOverview from "./pages/formalization/Overview";
import AllProcesses from "./pages/formalization/processes/AllProcesses";
import InFormalization from "./pages/formalization/processes/InFormalization";
import AwaitingPayment from "./pages/formalization/processes/AwaitingPayment";
import CompletedProcesses from "./pages/formalization/processes/Completed";
import AllDocuments from "./pages/formalization/documents/AllDocuments";
import Templates from "./pages/formalization/documents/Templates";
import AllCharges from "./pages/formalization/charges/AllCharges";
import PendingPayments from "./pages/formalization/charges/PendingPayments";
import ReceivedPayments from "./pages/formalization/charges/ReceivedPayments";
import AdminRules from "./pages/formalization/automation/AdminRules";
import FormalizationFollowups from "./pages/formalization/automation/Followups";
import AutentiqueIntegration from "./pages/formalization/integrations/Autentique";
import StripeIntegration from "./pages/formalization/integrations/Stripe";
import AsaasIntegration from "./pages/formalization/integrations/Asaas";
// Settings Module
import SettingsGeneral from "./pages/settings/General";
import SettingsCompany from "./pages/settings/Company";
import SettingsBranding from "./pages/settings/Branding";
import SettingsUsersPermissions from "./pages/settings/UsersPermissions";
import SettingsAI from "./pages/settings/AISettings";
import SettingsKnowledge from "./pages/settings/Knowledge";
import SettingsCommunication from "./pages/settings/CommunicationSettings";
import SettingsScheduling from "./pages/settings/SchedulingSettings";
import SettingsFunnels from "./pages/settings/FunnelsSettings";
import SettingsFormalization from "./pages/settings/FormalizationSettings";
import SettingsTracking from "./pages/settings/TrackingSettings";
import SettingsIntegrations from "./pages/settings/Integrations";
import SettingsSecurity from "./pages/settings/SecurityLogs";

const queryClient = new QueryClient();

// Component to handle redirect if user is already logged in
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const { memberships, loading: tenantLoading, membershipsFetched } = useTenant();

  if (authLoading || (session && (tenantLoading || !membershipsFetched))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session) {
    if (membershipsFetched && memberships.length > 0) {
      return <Navigate to="/" replace />;
    }
    if (membershipsFetched && memberships.length === 0) {
      return <Navigate to="/create-organization" replace />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

// Component to check if user has an organization
function RequireOrganization({ children }: { children: React.ReactNode }) {
  const { memberships, loading, membershipsFetched } = useTenant();

  if (loading || !membershipsFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (membershipsFetched && memberships.length === 0) {
    return <Navigate to="/create-organization" replace />;
  }

  return <>{children}</>;
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Create Organization - Protected but doesn't require org */}
      <Route
        path="/create-organization"
        element={
          <ProtectedRoute>
            <CreateOrganization />
          </ProtectedRoute>
        }
      />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RequireOrganization>
              <Index />
            </RequireOrganization>
          </ProtectedRoute>
        }
      />
      {/* Pessoas */}
      <Route path="/pessoas" element={<ProtectedRoute><RequireOrganization><PeopleManagement /></RequireOrganization></ProtectedRoute>} />
      <Route path="/pessoas/:id" element={<ProtectedRoute><RequireOrganization><PersonDetails /></RequireOrganization></ProtectedRoute>} />
      <Route path="/pessoas/perfis" element={<ProtectedRoute><RequireOrganization><ProfilesIdentities /></RequireOrganization></ProtectedRoute>} />
      <Route path="/pessoas/historico" element={<ProtectedRoute><RequireOrganization><HistoryJourney /></RequireOrganization></ProtectedRoute>} />
      {/* Comercial (CRM) */}
      <Route path="/comercial/oportunidades" element={<ProtectedRoute><RequireOrganization><Opportunities /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comercial/oportunidades/nova" element={<ProtectedRoute><RequireOrganization><OpportunityDetails /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comercial/oportunidades/:id" element={<ProtectedRoute><RequireOrganization><OpportunityDetails /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comercial/kanban" element={<ProtectedRoute><RequireOrganization><Pipeline /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comercial/atividades" element={<ProtectedRoute><RequireOrganization><Activities /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comercial/vendedores" element={<ProtectedRoute><RequireOrganization><Salespeople /></RequireOrganization></ProtectedRoute>} />
      {/* Funis & Jornadas */}
      <Route path="/funis" element={<ProtectedRoute><RequireOrganization><FunnelsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/funis/editor" element={<ProtectedRoute><RequireOrganization><FunnelEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/funis/jornadas" element={<ProtectedRoute><RequireOrganization><Journeys /></RequireOrganization></ProtectedRoute>} />
      <Route path="/funis/gargalos" element={<ProtectedRoute><RequireOrganization><BottleneckAnalysis /></RequireOrganization></ProtectedRoute>} />
      <Route path="/funis/atribuicao" element={<ProtectedRoute><RequireOrganization><FunnelAttribution /></RequireOrganization></ProtectedRoute>} />
      {/* Comunicação */}
      <Route path="/comunicacao" element={<ProtectedRoute><RequireOrganization><CommunicationOverview /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/ia/agentes" element={<ProtectedRoute><RequireOrganization><AgentsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/ia/agentes/:id" element={<ProtectedRoute><RequireOrganization><AgentEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/ia/orquestrador" element={<ProtectedRoute><RequireOrganization><Orchestrator /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/fluxos" element={<ProtectedRoute><RequireOrganization><FlowsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/fluxos/editor" element={<ProtectedRoute><RequireOrganization><FlowEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/fluxos/editor/:id" element={<ProtectedRoute><RequireOrganization><FlowEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/canais" element={<ProtectedRoute><RequireOrganization><ChannelsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/canais/:channelId" element={<ProtectedRoute><RequireOrganization><ChannelConfig /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/conversas" element={<ProtectedRoute><RequireOrganization><Conversations /></RequireOrganization></ProtectedRoute>} />
      <Route path="/comunicacao/performance" element={<ProtectedRoute><RequireOrganization><CommunicationPerformance /></RequireOrganization></ProtectedRoute>} />
      {/* Produtos & Ofertas */}
      <Route path="/produtos/catalogo/produtos" element={<ProtectedRoute><RequireOrganization><ProductsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/catalogo/produtos/:id" element={<ProtectedRoute><RequireOrganization><ProductEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/catalogo/servicos" element={<ProtectedRoute><RequireOrganization><ServicesList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/catalogo/servicos/:id" element={<ProtectedRoute><RequireOrganization><ServiceEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/ofertas/ativas" element={<ProtectedRoute><RequireOrganization><OffersList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/ofertas/nova" element={<ProtectedRoute><RequireOrganization><OfferEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/ofertas/:id" element={<ProtectedRoute><RequireOrganization><OfferEditor /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/ofertas/arquivadas" element={<ProtectedRoute><RequireOrganization><OffersArchived /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/precificacao/planos" element={<ProtectedRoute><RequireOrganization><Plans /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/precificacao/condicoes" element={<ProtectedRoute><RequireOrganization><PaymentConditions /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/bundles" element={<ProtectedRoute><RequireOrganization><Bundles /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/integracoes/funis" element={<ProtectedRoute><RequireOrganization><FunnelIntegration /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/integracoes/ia" element={<ProtectedRoute><RequireOrganization><AIIntegration /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/integracoes/ads" element={<ProtectedRoute><RequireOrganization><AdsIntegration /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/performance" element={<ProtectedRoute><RequireOrganization><ProductsPerformance /></RequireOrganization></ProtectedRoute>} />
      <Route path="/produtos/performance/ab-tests" element={<ProtectedRoute><RequireOrganization><ABTests /></RequireOrganization></ProtectedRoute>} />
      {/* Tráfego & Ads */}
      <Route path="/trafego" element={<ProtectedRoute><RequireOrganization><TrafficOverview /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/contas" element={<ProtectedRoute><RequireOrganization><AccountsPlatforms /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/campanhas" element={<ProtectedRoute><RequireOrganization><CampaignsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/campanhas/:campaignId/grupos" element={<ProtectedRoute><RequireOrganization><AdGroups /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/campanhas/:campaignId/grupos/:groupId/anuncios" element={<ProtectedRoute><RequireOrganization><AdsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/grupos" element={<ProtectedRoute><RequireOrganization><AdGroups /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/anuncios" element={<ProtectedRoute><RequireOrganization><AdsList /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/planejamento/keywords" element={<ProtectedRoute><RequireOrganization><Keywords /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/planejamento/publicos" element={<ProtectedRoute><RequireOrganization><Audiences /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/planejamento/orcamento" element={<ProtectedRoute><RequireOrganization><BudgetProjections /></RequireOrganization></ProtectedRoute>} />
      <Route path="/trafego/ia" element={<ProtectedRoute><RequireOrganization><AIOptimization /></RequireOrganization></ProtectedRoute>} />
      {/* Traqueamento & Atribuição */}
      <Route path="/traqueamento" element={<ProtectedRoute><RequireOrganization><TrackingOverview /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/origens/fontes" element={<ProtectedRoute><RequireOrganization><SourcesChannels /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/origens/campanhas" element={<ProtectedRoute><RequireOrganization><TrackingCampaigns /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/origens/utm" element={<ProtectedRoute><RequireOrganization><UTMGenerator /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/eventos/padrao" element={<ProtectedRoute><RequireOrganization><StandardEvents /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/eventos/custom" element={<ProtectedRoute><RequireOrganization><CustomEvents /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/eventos/timeline" element={<ProtectedRoute><RequireOrganization><EventTimeline /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/jornadas/pessoas" element={<ProtectedRoute><RequireOrganization><PeopleJourneys /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/jornadas/funil" element={<ProtectedRoute><RequireOrganization><FunnelJourneys /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/jornadas/caminhos" element={<ProtectedRoute><RequireOrganization><PathAnalysis /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/atribuicao/modelos" element={<ProtectedRoute><RequireOrganization><AttributionModels /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/atribuicao/comparacao" element={<ProtectedRoute><RequireOrganization><ModelComparison /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/atribuicao/receita" element={<ProtectedRoute><RequireOrganization><RevenueConversions /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/performance/canal" element={<ProtectedRoute><RequireOrganization><PerformanceByChannel /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/performance/campanha" element={<ProtectedRoute><RequireOrganization><PerformanceByCampaign /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/performance/oferta" element={<ProtectedRoute><RequireOrganization><PerformanceByOffer /></RequireOrganization></ProtectedRoute>} />
      <Route path="/traqueamento/performance/agente" element={<ProtectedRoute><RequireOrganization><PerformanceByAgent /></RequireOrganization></ProtectedRoute>} />
      {/* Agendamentos */}
      <Route path="/agendamentos" element={<ProtectedRoute><RequireOrganization><SchedulingOverview /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/eventos" element={<ProtectedRoute><RequireOrganization><AllEvents /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/eventos/followups" element={<ProtectedRoute><RequireOrganization><Followups /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/eventos/reunioes" element={<ProtectedRoute><RequireOrganization><Meetings /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/eventos/prazos" element={<ProtectedRoute><RequireOrganization><Deadlines /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/calendario/dia" element={<ProtectedRoute><RequireOrganization><CalendarView /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/calendario/semana" element={<ProtectedRoute><RequireOrganization><CalendarView /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/calendario/mes" element={<ProtectedRoute><RequireOrganization><CalendarView /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/calendario/agenda" element={<ProtectedRoute><RequireOrganization><CalendarView /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/proximos-passos" element={<ProtectedRoute><RequireOrganization><NextSteps /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/automacao/regras" element={<ProtectedRoute><RequireOrganization><FollowupRules /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/automacao/confirmacoes" element={<ProtectedRoute><RequireOrganization><Confirmations /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/automacao/lembretes" element={<ProtectedRoute><RequireOrganization><Reminders /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/recursos/agendas" element={<ProtectedRoute><RequireOrganization><SchedulingAgendas /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/recursos/locais" element={<ProtectedRoute><RequireOrganization><Locations /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/recursos/tipos" element={<ProtectedRoute><RequireOrganization><EventTypes /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/integracoes/google-calendar" element={<ProtectedRoute><RequireOrganization><GoogleCalendar /></RequireOrganization></ProtectedRoute>} />
      <Route path="/agendamentos/integracoes/google-meet" element={<ProtectedRoute><RequireOrganization><GoogleMeet /></RequireOrganization></ProtectedRoute>} />
      {/* Formalização & Receita */}
      <Route path="/formalizacao" element={<ProtectedRoute><RequireOrganization><FormalizationOverview /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/processos" element={<ProtectedRoute><RequireOrganization><AllProcesses /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/processos/formalizacao" element={<ProtectedRoute><RequireOrganization><InFormalization /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/processos/pagamento" element={<ProtectedRoute><RequireOrganization><AwaitingPayment /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/processos/concluidos" element={<ProtectedRoute><RequireOrganization><CompletedProcesses /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/documentos" element={<ProtectedRoute><RequireOrganization><AllDocuments /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/documentos/templates" element={<ProtectedRoute><RequireOrganization><Templates /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/cobrancas" element={<ProtectedRoute><RequireOrganization><AllCharges /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/cobrancas/pendentes" element={<ProtectedRoute><RequireOrganization><PendingPayments /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/cobrancas/recebidos" element={<ProtectedRoute><RequireOrganization><ReceivedPayments /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/automacao/regras" element={<ProtectedRoute><RequireOrganization><AdminRules /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/automacao/followups" element={<ProtectedRoute><RequireOrganization><FormalizationFollowups /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/integracoes/autentique" element={<ProtectedRoute><RequireOrganization><AutentiqueIntegration /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/integracoes/stripe" element={<ProtectedRoute><RequireOrganization><StripeIntegration /></RequireOrganization></ProtectedRoute>} />
      <Route path="/formalizacao/integracoes/asaas" element={<ProtectedRoute><RequireOrganization><AsaasIntegration /></RequireOrganization></ProtectedRoute>} />
      {/* Configurações */}
      <Route path="/configuracoes/geral" element={<ProtectedRoute><RequireOrganization><SettingsGeneral /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/empresa" element={<ProtectedRoute><RequireOrganization><SettingsCompany /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/identidade-visual" element={<ProtectedRoute><RequireOrganization><SettingsBranding /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/usuarios" element={<ProtectedRoute><RequireOrganization><SettingsUsersPermissions /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/ia" element={<ProtectedRoute><RequireOrganization><SettingsAI /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/conhecimento" element={<ProtectedRoute><RequireOrganization><SettingsKnowledge /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/comunicacao" element={<ProtectedRoute><RequireOrganization><SettingsCommunication /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/agendamentos" element={<ProtectedRoute><RequireOrganization><SettingsScheduling /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/funis" element={<ProtectedRoute><RequireOrganization><SettingsFunnels /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/formalizacao" element={<ProtectedRoute><RequireOrganization><SettingsFormalization /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/traqueamento" element={<ProtectedRoute><RequireOrganization><SettingsTracking /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/integracoes" element={<ProtectedRoute><RequireOrganization><SettingsIntegrations /></RequireOrganization></ProtectedRoute>} />
      <Route path="/configuracoes/seguranca" element={<ProtectedRoute><RequireOrganization><SettingsSecurity /></RequireOrganization></ProtectedRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TenantProvider>
            <AppRoutes />
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
