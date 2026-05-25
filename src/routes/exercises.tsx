import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/exercises")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <h1>Exercises</h1>

      <Button asChild>
        <Link to="/">Go to sessions</Link>
      </Button>
    </main>
  );
}
