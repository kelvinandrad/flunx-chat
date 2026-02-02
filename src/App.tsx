import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loader2 } from "lucide-react";
// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CreateOrganization from "./pages/auth/CreateOrganization";
// Chat
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InboxList from "./pages/chat/InboxList";
import ConversationList from "./pages/chat/ConversationList";
import ConversationView from "./pages/chat/ConversationView";
import ChatPage from "./pages/chat/ChatPage";
import ChannelsList from "./pages/communication/channels/ChannelsList";
import SettingsChat from "./pages/settings/SettingsChat";

const queryClient = new QueryClient();

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
    if (membershipsFetched && memberships.length > 0) return <Navigate to="/" replace />;
    if (membershipsFetched && memberships.length === 0) return <Navigate to="/create-organization" replace />;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

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

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/create-organization" element={<ProtectedRoute><CreateOrganization /></ProtectedRoute>} />

    <Route path="/" element={<ProtectedRoute><RequireOrganization><Index /></RequireOrganization></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute><RequireOrganization><ChatPage /></RequireOrganization></ProtectedRoute>} />
    <Route path="/inboxes" element={<ProtectedRoute><RequireOrganization><InboxList /></RequireOrganization></ProtectedRoute>} />
    <Route path="/canais" element={<ProtectedRoute><RequireOrganization><ChannelsList /></RequireOrganization></ProtectedRoute>} />
    <Route path="/inboxes/:inboxId/conversations" element={<ProtectedRoute><RequireOrganization><ConversationList /></RequireOrganization></ProtectedRoute>} />
    <Route path="/inboxes/:inboxId/conversations/:conversationId" element={<ProtectedRoute><RequireOrganization><ConversationView /></RequireOrganization></ProtectedRoute>} />
    <Route path="/configuracoes" element={<ProtectedRoute><RequireOrganization><SettingsChat /></RequireOrganization></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

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
