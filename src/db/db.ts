import { Dexie, type EntityTable } from "dexie";
import type { Exercise, ExerciseEntry, Session } from "./types";

export const db = new Dexie("FitNotesDatabase") as Dexie & {
  exercises: EntityTable<Exercise, "id">;
  sessions: EntityTable<Session, "id">;
  exerciseEntries: EntityTable<ExerciseEntry, "id">;
};

db.version(6).stores({
  exercises: "id, name",
  sessions: "id, date",
  exerciseEntries: "id, sessionId",
});
