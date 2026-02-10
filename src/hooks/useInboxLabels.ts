import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type InboxLabel = {
  id: string;
  inbox_id: string;
  evolution_label_id: string;
  name: string | null;
  color: number | null;
  deleted: boolean;
  predefined_id: string | null;
  created_at: string;
  updated_at: string;
};

/** Cor da Evolution (0–18) para classe Tailwind. */
const EVOLUTION_COLOR_CLASSES: string[] = [
  "bg-gray-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-fuchsia-500",
  "bg-slate-500",
];

export function evolutionColorToClass(color: number | null): string {
  if (color == null || color < 0) return "bg-gray-400";
  return EVOLUTION_COLOR_CLASSES[color] ?? "bg-gray-400";
}

/** Para uso em listas/select: id = evolution_label_id (usado em conversation.labels). */
export type InboxLabelOption = {
  id: string;
  name: string;
  colorClass: string;
};

export function useInboxLabels(inboxId: string | null | undefined) {
  const query = useQuery({
    queryKey: ["chat_inbox_labels", inboxId],
    queryFn: async (): Promise<InboxLabel[]> => {
      if (!inboxId) return [];
      const { data, error } = await supabase
        .from("chat_inbox_labels")
        .select("id, inbox_id, evolution_label_id, name, color, deleted, predefined_id, created_at, updated_at")
        .eq("inbox_id", inboxId)
        .eq("deleted", false)
        .order("name", { nullsFirst: false });

      if (error) throw error;
      return (data ?? []) as InboxLabel[];
    },
    enabled: !!inboxId,
  });

  const labels = (query.data ?? []) as InboxLabel[];
  const options: InboxLabelOption[] = labels.map((l) => ({
    id: l.evolution_label_id,
    name: l.name ?? l.evolution_label_id,
    colorClass: evolutionColorToClass(l.color),
  }));

  const labelMap: Record<string, { name: string; colorClass: string }> = {};
  options.forEach((o) => {
    labelMap[o.id] = { name: o.name, colorClass: o.colorClass };
  });

  return {
    ...query,
    labels,
    options,
    labelMap,
  };
}
