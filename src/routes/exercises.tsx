import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/exercises")({
  component: RouteComponent,
});

function RouteComponent() {
  const exercises = useLiveQuery(() => db.exercises.toArray());

  return (
    <main>
      <h1>Exercises</h1>

      <ul>
        {exercises?.map((ex) => (
          <li key={ex.id}>{ex.name}</li>
        ))}
      </ul>

      <Button asChild>
        <Link to="/">Go to sessions</Link>
      </Button>
    </main>
  );
}
