import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Clock,
  CalendarIcon,
  MessageSquare,
  Bell,
  Trash2,
  Edit2,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduledMessage {
  id: string;
  content: string;
  scheduledAt: string;
  status: "pending" | "sent" | "failed" | "cancelled";
  type: "follow-up" | "reminder" | "promotion" | "custom";
}

interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueAt: string;
  status: "active" | "completed" | "dismissed";
}

interface ContactAutomationTabProps {
  scheduledMessages: ScheduledMessage[];
  reminders: Reminder[];
  onScheduleMessage?: (message: Omit<ScheduledMessage, "id" | "status">) => void;
  onCancelMessage?: (messageId: string) => void;
  onCreateReminder?: (reminder: Omit<Reminder, "id" | "status">) => void;
  onCompleteReminder?: (reminderId: string) => void;
  onDismissReminder?: (reminderId: string) => void;
}

const MESSAGE_TYPES = [
  { value: "follow-up", label: "Follow-up", icon: MessageSquare },
  { value: "reminder", label: "Lembrete", icon: Bell },
  { value: "promotion", label: "Promoção", icon: CheckCircle2 },
  { value: "custom", label: "Personalizada", icon: Edit2 },
];

const MESSAGE_TEMPLATES: Record<string, string[]> = {
  "follow-up": [
    "Olá! Tudo bem? Gostaria de saber se teve a oportunidade de analisar nossa proposta.",
    "Oi! Passando para ver se posso ajudar com alguma dúvida sobre nosso produto/serviço.",
    "Olá! Como está indo? Estou à disposição para qualquer esclarecimento.",
  ],
  reminder: [
    "Lembrete: não esqueça do nosso compromisso!",
    "Passando para lembrar sobre o que conversamos.",
  ],
  promotion: [
    "Temos uma oferta especial para você! Que tal conversarmos?",
    "Novidades exclusivas chegaram! Posso te contar mais?",
  ],
};

export function ContactAutomationTab({
  scheduledMessages,
  reminders,
  onScheduleMessage,
  onCancelMessage,
  onCreateReminder,
  onCompleteReminder,
  onDismissReminder,
}: ContactAutomationTabProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [messageType, setMessageType] = useState<string>("follow-up");
  const [messageContent, setMessageContent] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");

  const handleScheduleMessage = () => {
    if (!selectedDate || !messageContent.trim()) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    onScheduleMessage?.({
      content: messageContent.trim(),
      scheduledAt: scheduledAt.toISOString(),
      type: messageType as ScheduledMessage["type"],
    });

    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setMessageContent("");
    setIsScheduling(false);
  };

  const handleCreateReminder = () => {
    if (!selectedDate || !reminderTitle.trim()) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const dueAt = new Date(selectedDate);
    dueAt.setHours(hours, minutes, 0, 0);

    onCreateReminder?.({
      title: reminderTitle.trim(),
      description: reminderDescription.trim() || undefined,
      dueAt: dueAt.toISOString(),
    });

    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setReminderTitle("");
    setReminderDescription("");
    setIsCreatingReminder(false);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (status: ScheduledMessage["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Agendada</Badge>;
      case "sent":
        return <Badge className="bg-green-500">Enviada</Badge>;
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelada</Badge>;
    }
  };

  // Filter active reminders and sort by due date
  const activeReminders = reminders
    .filter((r) => r.status === "active")
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const pendingMessages = scheduledMessages
    .filter((m) => m.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

  return (
    <div className="space-y-4">
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1">
              <Clock className="h-5 w-5" />
              <span className="text-xs">Agendar mensagem</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar mensagem</DialogTitle>
              <DialogDescription>
                Programe o envio automático de uma mensagem
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Message type */}
              <div className="space-y-2">
                <Label>Tipo de mensagem</Label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MESSAGE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Templates */}
              {MESSAGE_TEMPLATES[messageType] && (
                <div className="space-y-2">
                  <Label>Sugestões</Label>
                  <div className="space-y-1">
                    {MESSAGE_TEMPLATES[messageType].map((template, i) => (
                      <button
                        key={i}
                        onClick={() => setMessageContent(template)}
                        className={cn(
                          "w-full text-left text-sm p-2 rounded border transition-colors",
                          messageContent === template
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message content */}
              <div className="space-y-2">
                <Label>Mensagem</Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Digite a mensagem..."
                  rows={4}
                />
              </div>

              {/* Date and time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                          : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduling(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleScheduleMessage}
                disabled={!selectedDate || !messageContent.trim()}
              >
                Agendar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreatingReminder} onOpenChange={setIsCreatingReminder}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1">
              <Bell className="h-5 w-5" />
              <span className="text-xs">Criar lembrete</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar lembrete</DialogTitle>
              <DialogDescription>
                Receba um lembrete sobre este contato
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="Ex: Ligar para confirmar reunião"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                  placeholder="Detalhes adicionais..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                          : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreatingReminder(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateReminder}
                disabled={!selectedDate || !reminderTitle.trim()}
              >
                Criar lembrete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Pending messages */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Mensagens agendadas ({pendingMessages.length})
        </h4>

        {pendingMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma mensagem agendada
          </p>
        ) : (
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-2">
              {pendingMessages.map((msg) => (
                <Card key={msg.id} className="p-3 min-w-0 overflow-hidden">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(msg.scheduledAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive flex-shrink-0"
                      onClick={() => onCancelMessage?.(msg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Separator />

      {/* Reminders */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Lembretes ({activeReminders.length})
        </h4>

        {activeReminders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum lembrete ativo
          </p>
        ) : (
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-2">
              {activeReminders.map((reminder) => {
                const isOverdue = new Date(reminder.dueAt) < new Date();
                return (
                  <Card
                    key={reminder.id}
                    className={cn("p-3 min-w-0 overflow-hidden", isOverdue && "border-destructive/50")}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-start gap-2">
                          <p className="text-sm font-medium break-words min-w-0">
                            {reminder.title}
                          </p>
                          {isOverdue && (
                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                        {reminder.description && (
                          <p className="text-xs text-muted-foreground break-words mt-0.5">
                            {reminder.description}
                          </p>
                        )}
                        <p
                          className={cn(
                            "text-xs mt-1",
                            isOverdue
                              ? "text-destructive"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatDateTime(reminder.dueAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-green-600 flex-shrink-0"
                        onClick={() => onCompleteReminder?.(reminder.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
