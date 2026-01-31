import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Users,
  UserCircle,
  Briefcase,
  ShieldCheck,
  Settings,
  Eye,
  Edit,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockProfiles = [
  {
    id: "1",
    name: "Lead",
    description: "Pessoa que demonstrou interesse mas ainda não é cliente",
    icon: UserCircle,
    color: "blue",
    active: true,
    peopleCount: 1245,
    permissions: ["Visualizar produtos", "Receber comunicações", "Acessar portal"],
    modules: ["Funis", "Comunicação"],
  },
  {
    id: "2",
    name: "Cliente",
    description: "Pessoa que já adquiriu algum produto ou serviço",
    icon: Users,
    color: "green",
    active: true,
    peopleCount: 856,
    permissions: [
      "Visualizar produtos",
      "Acessar área do cliente",
      "Abrir chamados",
      "Visualizar contratos",
    ],
    modules: ["Produtos", "Contratos", "Comunicação", "Suporte"],
  },
  {
    id: "3",
    name: "Usuário do Sistema",
    description: "Pessoa com acesso ao painel administrativo",
    icon: Settings,
    color: "purple",
    active: true,
    peopleCount: 23,
    permissions: [
      "Acessar dashboard",
      "Gerenciar pessoas",
      "Visualizar relatórios",
      "Configurar sistema",
    ],
    modules: ["Dashboard", "Pessoas", "Relatórios", "Configurações"],
  },
  {
    id: "4",
    name: "Vendedor",
    description: "Usuário responsável por vendas e negociações",
    icon: Briefcase,
    color: "orange",
    active: true,
    peopleCount: 12,
    permissions: [
      "Acessar CRM",
      "Gerenciar oportunidades",
      "Visualizar metas",
      "Enviar propostas",
    ],
    modules: ["CRM", "Funis", "Comunicação", "Relatórios"],
  },
  {
    id: "5",
    name: "Administrador",
    description: "Acesso total ao sistema com todas as permissões",
    icon: ShieldCheck,
    color: "red",
    active: true,
    peopleCount: 3,
    permissions: ["Acesso total", "Gerenciar usuários", "Configurar integrações", "Billing"],
    modules: ["Todos os módulos"],
  },
  {
    id: "6",
    name: "Parceiro",
    description: "Empresa ou pessoa parceira com acesso limitado",
    icon: Users,
    color: "teal",
    active: false,
    peopleCount: 8,
    permissions: ["Visualizar leads compartilhados", "Registrar indicações"],
    modules: ["Portal de Parceiros"],
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "border-green-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/20",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    border: "border-orange-500/20",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-500/20",
  },
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-600",
    border: "border-teal-500/20",
  },
};

export default function ProfilesIdentities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<(typeof mockProfiles)[0] | null>(null);

  const filteredProfiles = mockProfiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Perfis & Identidades</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os papéis e permissões associados às pessoas
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Perfil
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar perfis..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Profiles Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => {
            const Icon = profile.icon;
            const colors = colorClasses[profile.color];

            return (
              <Card
                key={profile.id}
                className={`border-border/50 transition-all hover:shadow-md cursor-pointer ${
                  !profile.active ? "opacity-60" : ""
                }`}
                onClick={() => setSelectedProfile(profile)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2.5 ${colors.bg}`}>
                        <Icon className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {profile.name}
                          {!profile.active && (
                            <Badge variant="secondary" className="text-xs">
                              Inativo
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {profile.peopleCount} pessoas
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          {profile.active ? (
                            <>
                              <X className="h-4 w-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{profile.description}</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        Módulos acessíveis
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {profile.modules.slice(0, 3).map((module) => (
                          <Badge
                            key={module}
                            variant="outline"
                            className="text-xs bg-muted/50"
                          >
                            {module}
                          </Badge>
                        ))}
                        {profile.modules.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-muted/50">
                            +{profile.modules.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Profile Detail Dialog */}
        <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent className="max-w-lg">
            {selectedProfile && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2.5 ${colorClasses[selectedProfile.color].bg}`}
                    >
                      <selectedProfile.icon
                        className={`h-5 w-5 ${colorClasses[selectedProfile.color].text}`}
                      />
                    </div>
                    <div>
                      <DialogTitle>{selectedProfile.name}</DialogTitle>
                      <DialogDescription>{selectedProfile.description}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Status */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">Status do Perfil</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedProfile.active
                          ? "Ativo e disponível para uso"
                          : "Desativado temporariamente"}
                      </p>
                    </div>
                    <Switch checked={selectedProfile.active} />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <p className="text-2xl font-semibold">{selectedProfile.peopleCount}</p>
                      <p className="text-xs text-muted-foreground">Pessoas com este perfil</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <p className="text-2xl font-semibold">{selectedProfile.permissions.length}</p>
                      <p className="text-xs text-muted-foreground">Permissões</p>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <p className="text-sm font-medium mb-2">Permissões</p>
                    <div className="space-y-2">
                      {selectedProfile.permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modules */}
                  <div>
                    <p className="text-sm font-medium mb-2">Módulos Acessíveis</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.modules.map((module) => (
                        <Badge key={module} variant="secondary">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Edit className="h-4 w-4" />
                      Editar Perfil
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Users className="h-4 w-4" />
                      Ver Pessoas
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
