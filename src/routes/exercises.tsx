import ExerciseRow from "@/components/exercise-row";
import { db } from "@/db/db";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/exercises")({
  component: RouteComponent,
});

function RouteComponent() {
  const exercises = useLiveQuery(() => db.exercises.toArray());

  const grouped = exercises
    ? Object.entries(
        exercises.reduce<Record<string, typeof exercises>>((acc, ex) => {
          const group = ex.primaryMuscles[0];

          if (!acc[group]) acc[group] = [];

          acc[group].push(ex);

          return acc;
        }, {}),
      ).sort(([a], [b]) => a.localeCompare(b))
    : null;

  return (
    <main>
      <div className="flex flex-col gap-6 px-4">
        {exercises === undefined ? (
          <div className="flex justify-center py-16">
            <div className="border-primary/30 border-t-primary h-6 w-6 animate-spin rounded-full border-2" />
          </div>
        ) : (
          grouped?.map(([group, items]) => (
            <div key={group} className="">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-muted h-px flex-1" />
                <span className="text-primary-foreground text-xs uppercase">{group}</span>
                <div className="bg-muted h-px flex-1" />
              </div>

              <ul className="bg-card border-muted rounded-lg border">
                {items.map((ex) => (
                  <ExerciseRow key={ex.id} name={ex.name} />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
