import AddExerciseModal from "@/components/add-exercise-modal";
import Fab from "@/components/fab";
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { formatDate } from "@/lib/format-date";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Dumbbell, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sessions/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const session = useLiveQuery(() => db.sessions.get(id));

  const exercises = useLiveQuery(() => db.exercises.toArray());
  const exerciseMap = new Map(exercises?.map((ex) => [ex.id, ex.name]));

  const exerciseEntries = useLiveQuery(
    () => db.exerciseEntries.where("sessionId").equals(id).toArray(),
    [id],
  );
  const [modalOpen, setModalOpen] = useState(false);

  if (!session) return <div>Session not found</div>;

  const { weekday, day, month, year } = formatDate(session.date);

  async function handleDeleteExerciseEntry(id: string) {
    await db.exerciseEntries.delete(id);
  }

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

          <Button
            variant="destructive"
            size="icon-lg"
            onClick={() => console.log("Delete session")}
          >
            <Trash2 size={15} />
          </Button>
        </div>

        <div className="via-muted h-px bg-linear-to-r from-transparent to-transparent" />
      </header>

      <div className="py-4">
        {exerciseEntries && exerciseEntries.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            No exercises yet. Tap + to add one.
          </p>
        )}

        {exerciseEntries && exerciseEntries.length > 0 && (
          <ul className="flex flex-col gap-2">
            {exerciseEntries.map((entry) => (
              <li
                key={entry.id}
                className="bg-card border-muted flex items-center gap-3 rounded-lg border p-3"
              >
                <Dumbbell size={16} className="text-muted-foreground shrink-0" />

                <span className="flex-1 text-sm font-medium">
                  {exerciseMap.get(entry.exerciseId) ?? "Unknown"}
                </span>

                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => handleDeleteExerciseEntry(entry.id)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {exercises && (
        <>
          <Fab onClick={() => setModalOpen(true)} />

          <AddExerciseModal
            sessionId={id}
            exercises={exercises}
            open={modalOpen}
            onOpenChange={setModalOpen}
          />
        </>
      )}
    </>
  );
}
