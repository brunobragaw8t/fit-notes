import type { ExerciseSet } from "@/db/types";
import AddExerciseEntry from "@/components/add-exercise-entry";
import DeleteSession from "@/components/delete-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db/db";
import { formatDate } from "@/lib/format-date";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Dumbbell, Minus, Plus, Trash2 } from "lucide-react";

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

  async function handleDeleteSet(id: string) {
    await db.sets.delete(id);
  }

  async function handleUpdateWeight(id: string, weight: number) {
    await db.sets.update(id, { weight });
  }

  async function handleUpdateReps(id: string, reps: number) {
    await db.sets.update(id, { reps });
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

                <div className="flex flex-col gap-2 p-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground text-center text-xs">
                          #
                        </TableHead>

                        <TableHead className="text-muted-foreground text-center text-xs">
                          Weight
                        </TableHead>

                        <TableHead className="text-muted-foreground text-center text-xs">
                          Reps
                        </TableHead>

                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {(setsByEntryId.get(entry.id) ?? []).map((set) => (
                        <TableRow key={set.id}>
                          <TableCell className="text-muted-foreground text-center text-xs">
                            {set.order}
                          </TableCell>

                          <TableCell>
                            <Input
                              value={set.weight}
                              onChange={(e) => handleUpdateWeight(set.id, Number(e.target.value))}
                              className="text-center"
                            />
                          </TableCell>

                          <TableCell className="text-center">
                            <Input
                              value={set.reps}
                              onChange={(e) => handleUpdateReps(set.id, Number(e.target.value))}
                              className="text-center"
                            />
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleDeleteSet(set.id)}
                            >
                              <Minus />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

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
