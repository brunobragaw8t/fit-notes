import type { ExerciseSet } from "@/db/types";
import AddExerciseEntry from "@/components/add-exercise-entry";
import DeleteSession from "@/components/delete-session";
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { formatDate } from "@/lib/format-date";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Dumbbell, Plus, Trash2 } from "lucide-react";

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

  async function handleDeleteEntry(id: string) {
    await db.exerciseEntries.delete(id);
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

  async function handleAddSet(entryId: string) {
    const count = await db.sets.where("entryId").equals(entryId).count();

    await db.sets.add({
      id: crypto.randomUUID(),
      entryId,
      order: count,
      weight: 0,
      reps: 0,
    });
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
              <li key={entry.id} className="bg-card border-muted rounded-lg border">
                <div className="border-muted flex items-center gap-3 border-b p-3">
                  <Dumbbell size={16} className="text-muted-foreground shrink-0" />

                  <span className="flex-1 text-sm font-medium">
                    {exerciseMap.get(entry.exerciseId) ?? "Unknown"}
                  </span>

                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Weight</th>
                      <th>Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(setsByEntryId.get(entry.id) ?? []).map((set) => (
                      <tr key={set.id}>
                        <td>{set.weight}</td>
                        <td>{set.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddSet(entry.id)}
                  >
                    <Plus /> Add set
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {exercises && <AddExerciseEntry sessionId={id} exercises={exercises} />}
    </>
  );
}
