import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MapPin,
  Video,
  Building,
  Globe,
  Edit,
  Trash2,
  Users,
  Calendar
} from "lucide-react";

const locations = [
  {
    id: 1,
    name: "Google Meet",
    type: "online",
    description: "Videoconferência integrada com Google Calendar",
    autoCreate: true,
    eventsCount: 156,
    icon: Video,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    name: "Zoom",
    type: "online",
    description: "Integração com Zoom Meetings",
    autoCreate: false,
    eventsCount: 45,
    icon: Video,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: 3,
    name: "Sala de Reuniões A",
    type: "presential",
    description: "Térreo, capacidade 10 pessoas",
    capacity: 10,
    eventsCount: 32,
    icon: Building,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 4,
    name: "Sala de Reuniões B",
    type: "presential",
    description: "1º andar, capacidade 6 pessoas",
    capacity: 6,
    eventsCount: 28,
    icon: Building,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 5,
    name: "Auditório Principal",
    type: "presential",
    description: "Andar térreo, capacidade 50 pessoas",
    capacity: 50,
    eventsCount: 8,
    icon: Building,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 6,
    name: "Escritório do Cliente",
    type: "custom",
    description: "Endereço definido pelo cliente",
    eventsCount: 12,
    icon: MapPin,
    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  },
  {
    id: 7,
    name: "Café / Restaurante",
    type: "custom",
    description: "Local combinado para reuniões informais",
    eventsCount: 5,
    icon: MapPin,
    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  },
];

const typeLabels = {
  online: { label: "Online", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  presential: { label: "Presencial", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  custom: { label: "Customizado", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
};

export default function Locations() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Locais</h1>
            <p className="text-muted-foreground">Gerencie locais presenciais, online e customizados</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Local
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {locations.filter(l => l.type === "online").length}
                  </p>
                </div>
                <Video className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Presencial</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {locations.filter(l => l.type === "presential").length}
                  </p>
                </div>
                <Building className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customizado</p>
                  <p className="text-2xl font-bold text-violet-500">
                    {locations.filter(l => l.type === "custom").length}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locations by Type */}
        {["online", "presential", "custom"].map((type) => {
          const typeLocations = locations.filter(l => l.type === type);
          const typeConfig = typeLabels[type as keyof typeof typeLabels];
          
          return (
            <Card key={type} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  {type === "online" && <Video className="h-5 w-5 text-blue-500" />}
                  {type === "presential" && <Building className="h-5 w-5 text-emerald-500" />}
                  {type === "custom" && <MapPin className="h-5 w-5 text-violet-500" />}
                  {type === "online" ? "Locais Online" : type === "presential" ? "Locais Presenciais" : "Locais Customizados"}
                  <Badge variant="secondary" className="ml-2">{typeLocations.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {typeLocations.map((location) => (
                    <div
                      key={location.id}
                      className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${location.color}`}>
                          <location.icon className="h-5 w-5" />
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-foreground mb-1">{location.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{location.description}</p>
                      
                      <div className="flex flex-wrap gap-2 text-sm">
                        {location.capacity && (
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            {location.capacity} pessoas
                          </Badge>
                        )}
                        {location.autoCreate && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Auto-criar link
                          </Badge>
                        )}
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {location.eventsCount} eventos
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
