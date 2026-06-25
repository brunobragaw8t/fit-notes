import { db } from "@/db/db";
import type { ExerciseEntry, ExerciseSet, Session } from "@/db/types";
import { Dumbbell, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useLiveQuery } from "dexie-react-hooks";

interface ExerciseEntryProps {
  session: Session;
  entry: ExerciseEntry;
  name: string;
  sets?: ExerciseSet[];
}

export function ExerciseEntry({ session, entry, name, sets }: ExerciseEntryProps) {
  const previousSetsForThisExercise = useLiveQuery(async () => {
    const otherEntriesForThisExercise = await db.exerciseEntries
      .where("exerciseId")
      .equals(entry.exerciseId)
      .and((e) => e.id !== entry.id)
      .toArray();

    if (!otherEntriesForThisExercise.length) return null;

    const idsOfSessionsWhereThisExerciseShowsUp = [
      ...new Set(otherEntriesForThisExercise.map((e) => e.sessionId)),
    ];

    const sessionsWhereThisExerciseShowsUp = await db.sessions
      .where("id")
      .anyOf(idsOfSessionsWhereThisExerciseShowsUp)
      .and((s) => s.date < session.date)
      .sortBy("date");

    if (!sessionsWhereThisExerciseShowsUp.length) return null;

    const previousSessionWhereThisExerciseShowsUp = sessionsWhereThisExerciseShowsUp.at(-1);

    if (!previousSessionWhereThisExerciseShowsUp) return null;

    const previousEntryForThisExercise = otherEntriesForThisExercise.find(
      (entry) => entry.sessionId === previousSessionWhereThisExerciseShowsUp?.id,
    );

    if (!previousEntryForThisExercise) return null;

    return await db.sets.where("entryId").equals(previousEntryForThisExercise?.id).sortBy("order");
  });

  async function handleDeleteEntry() {
    await db.exerciseEntries.delete(entry.id);
  }

  async function handleAddSet() {
    const maxOrder =
      sets && sets.length ? sets.reduce((max, set) => Math.max(max, set.order), 0) : 0;
    const weight = sets && sets.length ? sets.at(-1)!.weight : 0;

    await db.sets.add({
      id: crypto.randomUUID(),
      entryId: entry.id,
      order: maxOrder + 1,
      weight,
      reps: 0,
    });
  }

  async function handleDeleteSet(id: string) {
    await db.sets.delete(id);
  }

  async function handleUpdateSetWeight(id: string, weight: number) {
    await db.sets.update(id, { weight });
  }

  async function handleUpdateSetReps(id: string, reps: number) {
    await db.sets.update(id, { reps });
  }

  return (
    <li className="bg-card border-muted rounded-lg border">
      <div className="border-muted flex items-center gap-3 border-b p-3">
        <Dumbbell size={16} className="text-muted-foreground shrink-0" />

        <span className="flex-1 text-sm font-medium">{name}</span>

        <Button size="icon-xs" variant="ghost" onClick={handleDeleteEntry}>
          <Trash2 />
        </Button>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {previousSetsForThisExercise && previousSetsForThisExercise.length > 0 && (
          <p className="text-muted-foreground text-center text-xs">
            Last time: {previousSetsForThisExercise.map((s) => `${s.weight}×${s.reps}`).join(", ")}
          </p>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground text-center text-xs">#</TableHead>
              <TableHead className="text-muted-foreground text-center text-xs">Weight</TableHead>
              <TableHead className="text-muted-foreground text-center text-xs">Reps</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {sets &&
              sets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell className="text-muted-foreground text-center text-xs">
                    {set.order}
                  </TableCell>

                  <TableCell>
                    <Input
                      value={set.weight}
                      onChange={(e) => handleUpdateSetWeight(set.id, Number(e.target.value))}
                      className="text-center"
                    />
                  </TableCell>

                  <TableCell className="text-center">
                    <Input
                      value={set.reps}
                      onChange={(e) => handleUpdateSetReps(set.id, Number(e.target.value))}
                      className="text-center"
                    />
                  </TableCell>

                  <TableCell>
                    <Button variant="ghost" size="icon-xs" onClick={() => handleDeleteSet(set.id)}>
                      <Minus />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Button variant="outline" size="sm" className="w-full" onClick={handleAddSet}>
          <Plus /> Add set
        </Button>
      </div>
    </li>
  );
}
