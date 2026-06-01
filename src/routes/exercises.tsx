import ExerciseRow from "@/components/exercise-row";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db/db";
import { groupExercisesByMuscle } from "@/lib/group-exercises-by-muscle";
import { searchExercises } from "@/lib/search-exercises";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/exercises")({
  component: RouteComponent,
});

function RouteComponent() {
  const exercisesRaw = useLiveQuery(() => db.exercises.toArray());

  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = searchExercises(exercisesRaw ?? [], search);
  const grouped = groupExercisesByMuscle(filtered);

  return (
    <>
      {!exercisesRaw ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full"
          />

          {search !== searchDebounced ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
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
      )}
    </>
  );
}
