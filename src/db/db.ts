import { Dexie, type EntityTable } from "dexie";
import type { Exercise, Session } from "./types";

export const db = new Dexie("FitNotesDatabase") as Dexie & {
  exercises: EntityTable<Exercise, "id">;
  sessions: EntityTable<Session, "id">;
};

db.version(3).stores({
  exercises: "id, name",
  sessions: "id, date",
});
