import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, AlertCircle } from "lucide-react";

export default function CreateOrganization() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { memberships, loading: tenantLoading, membershipsFetched, refreshMemberships } = useTenant();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (tenantLoading || !membershipsFetched) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (membershipsFetched && memberships.length > 0) {
    return <Navigate to="/" replace />;
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Use the database function to create org + member atomically
      const { data, error: rpcError } = await supabase
        .rpc("create_organization_with_owner", {
          p_name: name,
          p_slug: slug,
        });

      if (rpcError) {
        console.error("RPC Error:", rpcError);
        if (rpcError.message.includes("duplicate") || rpcError.message.includes("unique")) {
          setError("Já existe uma organização com este identificador. Escolha outro.");
        } else {
          setError("Ocorreu um erro ao criar a organização. Tente novamente.");
        }
        return;
      }

      // Refresh memberships in context
      await refreshMemberships();

      // Navigate to dashboard
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Crie sua organização
          </CardTitle>
          <CardDescription className="text-center">
            Configure sua empresa para começar a usar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome da empresa</Label>
              <Input
                id="name"
                type="text"
                placeholder="Minha Empresa Ltda"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Identificador único</Label>
              <Input
                id="slug"
                type="text"
                placeholder="minha-empresa"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Usado em URLs e identificação. Apenas letras minúsculas, números e hífens.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading || !name || !slug}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar organização"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PublicLayout>
  );
}
