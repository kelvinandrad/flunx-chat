import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsChat = () => (
  <AppLayout>
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
          <CardDescription>Configurações de canais, agentes e preferências serão adicionadas aqui.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">* Página mockada</p>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
);

export default SettingsChat;
