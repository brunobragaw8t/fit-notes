import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <h1>Sessions</h1>

      <Button asChild>
        <Link to="/exercises">Go to exercises</Link>
      </Button>
    </main>
  );
}
