import { db } from "@/db/db";
import type { Session } from "@/db/types";
import { formatDate } from "@/lib/format-date";
import { Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRight, Dumbbell, Layers } from "lucide-react";

interface SessionProps {
  session: Session;
}

export default function Session({ session }: SessionProps) {
  const { weekday, day, month, year } = formatDate(session.date);

  const entries = useLiveQuery(() =>
    db.exerciseEntries.where("sessionId").equals(session.id).toArray(),
  );

  const totalSets = useLiveQuery(
    () =>
      db.sets
        .where("entryId")
        .anyOf(entries?.map((e) => e.id) ?? [])
        .count(),
    [entries],
  );

  const stats = {
    exercises: {
      icon: Dumbbell,
      count: entries?.length ?? 0,
      label: entries?.length === 1 ? "ex" : "exs",
    },
    sets: {
      icon: Layers,
      count: totalSets,
      label: totalSets === 1 ? "set" : "sets",
    },
  };

  return (
    <Link
      to="/sessions/$id"
      params={{ id: session.id }}
      className="bg-card border-muted flex items-center gap-4 rounded-lg border p-4"
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs uppercase">{weekday}</span>
          <span className="text-primary-foreground text-2xl">{day}</span>
        </div>

        <span className="text-muted-foreground text-xs uppercase">
          {month} {year}
        </span>
      </div>

      <div className="bg-muted h-10 w-px" />

      <div className="flex flex-1 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="bg-primary/20 flex h-6 w-6 items-center justify-center rounded-md">
              <value.icon size={12} className="text-primary-foreground" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-primary-foreground text-sm">{value.count}</span>
              <span className="text-muted-foreground text-xs">{value.label}</span>
            </div>
          </div>
        ))}
      </div>

      <ChevronRight size={16} className="text-muted-foreground" />
    </Link>
  );
}
