import { Pencil, Trash2 } from "lucide-react";

export default function ExerciseRow({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-2 border-b px-3 py-2 last:border-b-0">
      <span className="text-primary-foreground flex-1 text-sm">{name}</span>

      <button className="text-muted-foreground flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90">
        <Pencil size={13} />
      </button>

      <button className="text-muted-foreground flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90">
        <Trash2 size={13} />
      </button>
    </li>
  );
}
