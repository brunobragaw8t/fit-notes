import AddExerciseEntry from "@/components/add-exercise-entry";
import DeleteSession from "@/components/delete-session";
import { ExerciseEntry } from "@/components/exercise-entry";
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import type { ExerciseSet } from "@/db/types";
import { formatDate } from "@/lib/format-date";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/sessions/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  /**
   * Session
   */

  const { id } = Route.useParams();
  const session = useLiveQuery(() => db.sessions.get(id));

  const { weekday, day, month, year } = session ? formatDate(session.date) : {};

  /**
   * Exercises
   */

  const exercises = useLiveQuery(() => db.exercises.toArray());
  const exerciseMap = new Map(exercises?.map((ex) => [ex.id, ex.name]));

  /**
   * Entries
   */

  const entries = useLiveQuery(
    () => db.exerciseEntries.where("sessionId").equals(id).sortBy("order"),
    [id],
  );
  const entriesIds = entries?.map((e) => e.id) ?? [];

  function handleUpdateEntryOrder(id: string, order: number) {
    if (order < 0 || order === entries?.length) return;
    db.exerciseEntries.update(id, { order });
  }

  /**
   * Sets
   */

  const sets = useLiveQuery(
    () => db.sets.where("entryId").anyOf(entriesIds).sortBy("order"),
    [entriesIds],
  );

  const setsByEntryId = new Map<string, ExerciseSet[]>();
  for (const set of sets ?? []) {
    const list = setsByEntryId.get(set.entryId);

    if (!list) {
      setsByEntryId.set(set.entryId, [set]);
      continue;
    }

    list.push(set);
  }

  if (!session) return <div>Session not found</div>;

  return (
    <>
      <header>
        <div className="flex items-center gap-3 pb-4">
          <Button asChild size="icon-lg" variant="outline">
            <Link to="/sessions">
              <ArrowLeft size={16} />
            </Link>
          </Button>

          <div className="flex flex-1 items-baseline gap-2">
            <h1 className="text-primary-foreground text-lg font-bold">
              {weekday}, {month} {day}
            </h1>

            <span className="text-muted-foreground text-xs">{year}</span>
          </div>

          <DeleteSession sessionId={id} />
        </div>

        <div className="via-muted h-px bg-linear-to-r from-transparent to-transparent" />
      </header>

      <div className="py-4">
        {entries && entries.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            No exercises yet. Tap + to add one.
          </p>
        )}

        {entries && entries.length > 0 && (
          <ul className="flex flex-col gap-2">
            {entries.map((entry) => (
              <ExerciseEntry
                key={entry.id}
                session={session}
                entry={entry}
                onUpdateEntryOrder={handleUpdateEntryOrder}
                name={exerciseMap.get(entry.exerciseId) ?? "Unknown"}
                sets={setsByEntryId.get(entry.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {exercises && <AddExerciseEntry sessionId={id} exercises={exercises} />}
    </>
  );
}
