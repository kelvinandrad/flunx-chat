import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit2, Trash2, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  isPinned?: boolean;
}

interface ContactNotesTabProps {
  notes: Note[];
  onAddNote?: (content: string) => void;
  onEditNote?: (noteId: string, content: string) => void;
  onDeleteNote?: (noteId: string) => void;
  onTogglePin?: (noteId: string) => void;
  currentUser?: { id: string; name: string; avatar?: string };
}

export function ContactNotesTab({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onTogglePin,
  currentUser = { id: "1", name: "Você" },
}: ContactNotesTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote?.(newNoteContent.trim());
      setNewNoteContent("");
      setIsAdding(false);
    }
  };

  const handleEditNote = (noteId: string) => {
    if (editContent.trim()) {
      onEditNote?.(noteId, editContent.trim());
      setEditingNoteId(null);
      setEditContent("");
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days === 1) return "Ontem";
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  // Sort notes: pinned first, then by date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="h-full flex flex-col">
      {/* Add note button/form */}
      <div className="mb-4">
        {isAdding ? (
          <div className="space-y-2">
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Escreva sua anotação..."
              className="min-h-[100px] resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewNoteContent("");
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
              >
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-10"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar anotação
          </Button>
        )}
      </div>

      {/* Notes list */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhuma anotação</p>
            <p className="text-sm mt-1">
              Adicione notas importantes sobre este contato
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "p-3 rounded-lg border",
                  note.isPinned
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border"
                )}
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px] resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNoteId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditNote(note.id)}
                        disabled={!editContent.trim()}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Note header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={note.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {note.author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {note.author.id === currentUser.id
                            ? "Você"
                            : note.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.createdAt)}
                        </span>
                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                          <span className="text-xs text-muted-foreground">
                            (editado)
                          </span>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEditing(note)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onTogglePin?.(note.id)}
                          >
                            {note.isPinned ? "Desafixar" : "Fixar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDeleteNote?.(note.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Note content */}
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
