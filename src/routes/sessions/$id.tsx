import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { formatDate } from "@/lib/format-date";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Trash2 } from "lucide-react";

export const Route = createFileRoute("/sessions/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const session = useLiveQuery(() => db.sessions.get(id));

  if (!session) return <div>Session not found</div>;

  const { weekday, day, month, year } = formatDate(session.date);

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
    </>
  );
}
