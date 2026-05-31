import CreateSession from "@/components/create-session";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db/db";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/")({
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
            <li key={session.id}>{session.date}</li>
          ))}
        </ul>
      )}
    </>
  );
}
