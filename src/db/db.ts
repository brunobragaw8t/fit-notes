import { Dexie, type EntityTable } from "dexie";
import type { Exercise, ExerciseEntry, ExerciseSet, Session } from "./types";

export const db = new Dexie("FitNotesDatabase") as Dexie & {
  exercises: EntityTable<Exercise, "id">;
  sessions: EntityTable<Session, "id">;
  exerciseEntries: EntityTable<ExerciseEntry, "id">;
  sets: EntityTable<ExerciseSet, "id">;
};

db.version(9).stores({
  exercises: "id, name",
  sessions: "id, date",
  exerciseEntries: "id, sessionId, exerciseId",
  sets: "id, entryId",
});
