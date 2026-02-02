import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  User,
  StickyNote,
  Briefcase,
  Zap,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { ContactInfoTab } from "./tabs/ContactInfoTab";
import { ContactNotesTab } from "./tabs/ContactNotesTab";
import { ContactCommercialTab } from "./tabs/ContactCommercialTab";
import { ContactAutomationTab } from "./tabs/ContactAutomationTab";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  createdAt?: string;
  labels?: string[];
  customFields?: Record<string, string>;
  isOnline?: boolean;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: { id: string; name: string; avatar?: string };
  isPinned?: boolean;
}

interface Proposal {
  id: string;
  title: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  totalValue: number;
  createdAt: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
}

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

interface ContactPanelProps {
  contact: Contact;
  notes: Note[];
  proposals: Proposal[];
  scheduledMessages: ScheduledMessage[];
  reminders: Reminder[];
  onClose: () => void;
  onUpdateContact?: (updates: Partial<Contact>) => void;
  onAddNote?: (content: string) => void;
  onEditNote?: (noteId: string, content: string) => void;
  onDeleteNote?: (noteId: string) => void;
  onTogglePinNote?: (noteId: string) => void;
  onCreateProposal?: (proposal: any) => void;
  onSendProposal?: (proposalId: string) => void;
  onCloseProposal?: (proposalId: string, status: "accepted" | "rejected") => void;
  onScheduleMessage?: (message: any) => void;
  onCancelMessage?: (messageId: string) => void;
  onCreateReminder?: (reminder: any) => void;
  onCompleteReminder?: (reminderId: string) => void;
}

export function ContactPanel({
  contact,
  notes,
  proposals,
  scheduledMessages,
  reminders,
  onClose,
  onUpdateContact,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onTogglePinNote,
  onCreateProposal,
  onSendProposal,
  onCloseProposal,
  onScheduleMessage,
  onCancelMessage,
  onCreateReminder,
  onCompleteReminder,
}: ContactPanelProps) {
  const [activeTab, setActiveTab] = useState("info");

  // Count badges
  const notesCount = notes.length;
  const pendingProposals = proposals.filter((p) =>
    ["draft", "sent", "viewed"].includes(p.status)
  ).length;
  const pendingAutomations =
    scheduledMessages.filter((m) => m.status === "pending").length +
    reminders.filter((r) => r.status === "active").length;

  return (
    <div className="h-full w-72 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-sm">Dados do contato</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-4 mx-4 mt-3 h-10">
          <TabsTrigger value="info" className="relative">
            <User className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="notes" className="relative">
            <StickyNote className="h-4 w-4" />
            {notesCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full px-1">
                {notesCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="commercial" className="relative">
            <Briefcase className="h-4 w-4" />
            {pendingProposals > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] bg-orange-500 text-white rounded-full px-1">
                {pendingProposals}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="automation" className="relative">
            <Zap className="h-4 w-4" />
            {pendingAutomations > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] bg-blue-500 text-white rounded-full px-1">
                {pendingAutomations}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <ScrollArea className="flex-1 mt-3">
          <TabsContent value="info" className="px-4 pb-4 m-0">
            <ContactInfoTab contact={contact} onUpdate={onUpdateContact} />
          </TabsContent>

          <TabsContent value="notes" className="px-4 pb-4 m-0 h-full">
            <ContactNotesTab
              notes={notes}
              onAddNote={onAddNote}
              onEditNote={onEditNote}
              onDeleteNote={onDeleteNote}
              onTogglePin={onTogglePinNote}
            />
          </TabsContent>

          <TabsContent value="commercial" className="px-4 pb-4 m-0">
            <ContactCommercialTab
              proposals={proposals}
              products={[]}
              onCreateProposal={onCreateProposal}
              onSendProposal={onSendProposal}
              onCloseProposal={onCloseProposal}
            />
          </TabsContent>

          <TabsContent value="automation" className="px-4 pb-4 m-0">
            <ContactAutomationTab
              scheduledMessages={scheduledMessages}
              reminders={reminders}
              onScheduleMessage={onScheduleMessage}
              onCancelMessage={onCancelMessage}
              onCreateReminder={onCreateReminder}
              onCompleteReminder={onCompleteReminder}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Footer actions */}
      <div className="p-3 border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1 gap-2" size="sm">
          <MessageSquare className="h-4 w-4" />
          Histórico
        </Button>
        <Button variant="outline" className="flex-1 gap-2" size="sm">
          <ExternalLink className="h-4 w-4" />
          Ver perfil
        </Button>
      </div>
    </div>
  );
}
