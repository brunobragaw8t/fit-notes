import ExerciseRow from "@/components/exercise-row";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db/db";
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
  const searchLower = searchDebounced.toLowerCase();

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  const exercises = exercisesRaw?.reduce<Record<string, typeof exercisesRaw>>((acc, ex) => {
    if (
      !ex.primaryMuscles[0].toLowerCase().includes(searchLower) &&
      !ex.name.toLowerCase().includes(searchLower)
    ) {
      return acc;
    }

    const group = ex.primaryMuscles[0];

    if (!acc[group]) acc[group] = [];

    acc[group].push(ex);

    return acc;
  }, {});

  return (
    <main>
      <div className="flex flex-col gap-6 px-4">
        {!exercisesRaw || !exercises ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <>
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
              Object.entries(exercises).map(([group, items]) => (
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
          </>
        )}
      </div>
    </main>
  );
}
