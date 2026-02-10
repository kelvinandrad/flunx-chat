import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Tag,
  Plus,
  X,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import type { InboxLabelOption } from "@/hooks/useInboxLabels";
import { cn } from "@/lib/utils";

interface ContactInfo {
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
}

interface ContactInfoTabProps {
  contact: ContactInfo;
  onUpdate?: (updates: Partial<ContactInfo>) => void;
  /** Etiquetas do canal (chat_inbox_labels). */
  inboxLabelOptions?: InboxLabelOption[];
}

export function ContactInfoTab({ contact, onUpdate, inboxLabelOptions = [] }: ContactInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(contact);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLabelToggle = (labelId: string) => {
    const currentLabels = editedContact.labels || [];
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter((l) => l !== labelId)
      : [...currentLabels, labelId];
    
    setEditedContact({ ...editedContact, labels: newLabels });
    onUpdate?.({ labels: newLabels });
  };

  const handleSave = () => {
    onUpdate?.(editedContact);
    setIsEditing(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-3">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {contact.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{contact.name}</h3>
        {contact.company && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {contact.company}
          </p>
        )}
      </div>

      <Separator />

      {/* Contact details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Informações</h4>

        {contact.phone && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{contact.phone}</p>
                <p className="text-xs text-muted-foreground">Telefone</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleCopy(contact.phone!, "phone")}
            >
              {copiedField === "phone" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {contact.email && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{contact.email}</p>
                <p className="text-xs text-muted-foreground">E-mail</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleCopy(contact.email!, "email")}
            >
              {copiedField === "email" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {contact.address && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{contact.address}</p>
              <p className="text-xs text-muted-foreground">Endereço</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{formatDate(contact.createdAt)}</p>
            <p className="text-xs text-muted-foreground">Primeiro contato</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Labels */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Etiquetas
          </h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {inboxLabelOptions.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma etiqueta no canal.</p>
          ) : (
            inboxLabelOptions.map((label) => {
              const isSelected = contact.labels?.includes(label.id);
              return (
                <button
                  key={label.id}
                  onClick={() => handleLabelToggle(label.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", label.colorClass)} />
                  {label.name}
                  {isSelected && <X className="h-3 w-3 ml-0.5" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      <Separator />

      {/* Custom fields */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">
            Campos personalizados
          </h4>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>

        {contact.customFields && Object.keys(contact.customFields).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(contact.customFields).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-3">
            Nenhum campo personalizado
          </p>
        )}
      </div>
    </div>
  );
}
