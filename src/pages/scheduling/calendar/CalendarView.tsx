import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  MessageCircle,
  Clock,
  Bot,
  AlertTriangle
} from "lucide-react";

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

const weekDays = [
  { name: "Seg", date: "20", isToday: false },
  { name: "Ter", date: "21", isToday: false },
  { name: "Qua", date: "22", isToday: true },
  { name: "Qui", date: "23", isToday: false },
  { name: "Sex", date: "24", isToday: false },
  { name: "Sáb", date: "25", isToday: false },
  { name: "Dom", date: "26", isToday: false },
];

const eventsData = [
  { id: 1, title: "Reunião ABC", type: "meeting", day: 2, startHour: 9, duration: 1, aiManaged: false },
  { id: 2, title: "Follow-up XYZ", type: "followup", day: 2, startHour: 11, duration: 0.5, aiManaged: true },
  { id: 3, title: "Demo Produto", type: "meeting", day: 2, startHour: 14, duration: 1.5, aiManaged: false, conflict: true },
  { id: 4, title: "Call Delta", type: "meeting", day: 2, startHour: 14, duration: 1, aiManaged: false, conflict: true },
  { id: 5, title: "Prazo: Contrato", type: "deadline", day: 3, startHour: 18, duration: 0.5, aiManaged: false },
  { id: 6, title: "Kick-off Epsilon", type: "meeting", day: 4, startHour: 10, duration: 2, aiManaged: false },
];

const allDayEvents = [
  { id: 7, title: "Prazo: Entrega Proposta", type: "deadline", day: 2 },
  { id: 8, title: "Lembrete: Faturamento", type: "reminder", day: 4 },
];

const monthDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - 2; // Start from previous month's last days
  return {
    date: day <= 0 ? 28 + day : day > 31 ? day - 31 : day,
    isCurrentMonth: day > 0 && day <= 31,
    isToday: day === 22,
    hasEvents: [5, 12, 15, 20, 22, 25, 28].includes(day),
  };
});

const agendaEvents = [
  { date: "Hoje, 22 Jan", events: [
    { time: "09:00", title: "Reunião Comercial - Empresa ABC", type: "meeting", duration: "1h" },
    { time: "11:00", title: "Follow-up Proposta XYZ", type: "followup", duration: "30min", aiManaged: true },
    { time: "14:00", title: "Demo de Produto", type: "meeting", duration: "1h30", conflict: true },
    { time: "14:00", title: "Call com Delta", type: "meeting", duration: "1h", conflict: true },
  ]},
  { date: "Amanhã, 23 Jan", events: [
    { time: "Todo o dia", title: "Prazo: Entrega Contrato", type: "deadline", duration: "" },
  ]},
  { date: "24 Jan, Quinta", events: [
    { time: "10:00", title: "Kick-off Projeto Epsilon", type: "meeting", duration: "2h" },
    { time: "15:00", title: "Lembrete: Faturamento", type: "reminder", duration: "" },
  ]},
];

const typeColors = {
  meeting: "bg-blue-500",
  followup: "bg-amber-500",
  deadline: "bg-red-500",
  reminder: "bg-violet-500",
};

interface CalendarViewProps {
  viewType?: "day" | "week" | "month" | "agenda";
}

export default function CalendarView({ viewType = "week" }: CalendarViewProps) {
  const [currentView, setCurrentView] = useState(viewType);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendário</h1>
            <p className="text-muted-foreground">Visualização clássica de eventos e agendamentos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        {/* Navigation & View Switcher */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline">Hoje</Button>
                <h2 className="text-lg font-semibold text-foreground ml-2">Janeiro 2025</h2>
              </div>
              <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as typeof currentView)}>
                <TabsList>
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-muted-foreground">Reunião</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-muted-foreground">Follow-up</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-muted-foreground">Prazo</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-violet-500" />
            <span className="text-muted-foreground">IA</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-muted-foreground">Conflito</span>
          </div>
        </div>

        {/* Calendar Views */}
        {currentView === "week" && (
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              {/* All-day events */}
              <div className="border-b border-border">
                <div className="grid grid-cols-8">
                  <div className="p-2 text-xs text-muted-foreground border-r border-border">Todo o dia</div>
                  {weekDays.map((day, idx) => (
                    <div key={day.name} className="p-2 border-r border-border last:border-r-0 min-h-[40px]">
                      {allDayEvents.filter(e => e.day === idx).map(event => (
                        <div key={event.id} className={`text-xs px-2 py-1 rounded ${typeColors[event.type as keyof typeof typeColors]} text-white truncate`}>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Header */}
              <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10">
                <div className="p-2 text-xs text-muted-foreground border-r border-border" />
                {weekDays.map((day) => (
                  <div
                    key={day.name}
                    className={`p-2 text-center border-r border-border last:border-r-0 ${
                      day.isToday ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">{day.name}</div>
                    <div className={`text-lg font-semibold ${day.isToday ? "text-primary" : "text-foreground"}`}>
                      {day.date}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Time Grid */}
              <div className="overflow-auto max-h-[600px]">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-border">
                    <div className="p-2 text-xs text-muted-foreground border-r border-border">
                      {`${hour}:00`}
                    </div>
                    {weekDays.map((day, dayIdx) => {
                      const dayEvents = eventsData.filter(e => e.day === dayIdx && e.startHour === hour);
                      return (
                        <div
                          key={`${day.name}-${hour}`}
                          className={`relative min-h-[60px] border-r border-border last:border-r-0 ${
                            day.isToday ? "bg-primary/5" : ""
                          } hover:bg-muted/50 cursor-pointer`}
                        >
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`absolute left-1 right-1 top-1 p-1 rounded text-xs text-white ${
                                typeColors[event.type as keyof typeof typeColors]
                              } ${event.conflict ? "border-2 border-red-700" : ""}`}
                              style={{ height: `${event.duration * 60 - 8}px` }}
                            >
                              <div className="flex items-center gap-1">
                                <span className="truncate font-medium">{event.title}</span>
                                {event.aiManaged && <Bot className="h-3 w-3 flex-shrink-0" />}
                                {event.conflict && <AlertTriangle className="h-3 w-3 flex-shrink-0" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === "day" && (
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader>
              <CardTitle className="text-foreground">Quarta-feira, 22 de Janeiro</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[600px]">
                {hours.map((hour) => {
                  const hourEvents = eventsData.filter(e => e.day === 2 && e.startHour === hour);
                  return (
                    <div key={hour} className="grid grid-cols-[80px_1fr] border-b border-border">
                      <div className="p-3 text-sm text-muted-foreground border-r border-border">
                        {`${hour}:00`}
                      </div>
                      <div className="relative min-h-[80px] p-2 hover:bg-muted/50 cursor-pointer">
                        {hourEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-2 rounded text-white mb-1 ${
                              typeColors[event.type as keyof typeof typeColors]
                            } ${event.conflict ? "border-2 border-red-700" : ""}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{event.title}</span>
                              <div className="flex items-center gap-1">
                                {event.aiManaged && <Bot className="h-4 w-4" />}
                                {event.conflict && <AlertTriangle className="h-4 w-4" />}
                              </div>
                            </div>
                            <div className="text-sm opacity-80">{event.duration}h</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === "month" && (
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`min-h-[100px] p-2 rounded border ${
                      day.isCurrentMonth ? "bg-card border-border" : "bg-muted/30 border-transparent"
                    } ${day.isToday ? "ring-2 ring-primary" : ""} hover:bg-muted/50 cursor-pointer`}
                  >
                    <div className={`text-sm font-medium ${
                      day.isToday ? "text-primary" : day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {day.date}
                    </div>
                    {day.hasEvents && day.isCurrentMonth && (
                      <div className="mt-1 space-y-1">
                        <div className="w-full h-1.5 rounded bg-blue-500" />
                        <div className="w-2/3 h-1.5 rounded bg-amber-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === "agenda" && (
          <div className="space-y-4">
            {agendaEvents.map((day) => (
              <Card key={day.date} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">{day.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.events.map((event, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 p-3 rounded-lg bg-muted/50 ${
                          event.conflict ? "border-2 border-red-500" : "border border-border"
                        }`}
                      >
                        <div className={`w-1 h-12 rounded ${typeColors[event.type as keyof typeof typeColors]}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{event.title}</span>
                            {event.aiManaged && (
                              <Badge variant="outline" className="border-violet-300 text-violet-600 dark:border-violet-700 dark:text-violet-400">
                                <Bot className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                            {event.conflict && (
                              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Conflito
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {event.time}
                            {event.duration && ` • ${event.duration}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
