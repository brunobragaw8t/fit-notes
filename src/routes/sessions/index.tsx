import CreateSession from "@/components/create-session";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db/db";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/sessions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const sessions = useLiveQuery(() => db.sessions.orderBy("date").reverse().limit(30).toArray());

  return (
    <>
      <CreateSession />

      {!sessions ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <Link to="/sessions/$id" params={{ id: session.id }}>
                {session.date}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
