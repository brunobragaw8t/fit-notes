import CreateSession from "@/components/create-session";
import Session from "@/components/session";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db/db";
import { createFileRoute } from "@tanstack/react-router";
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
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <Session session={session} key={session.id} />
          ))}
        </div>
      )}
    </>
  );
}
