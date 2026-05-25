import { Dexie, type EntityTable } from "dexie";

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
}

export const db = new Dexie("FitNotesDatabase") as Dexie & {
  exercises: EntityTable<Exercise, "id">;
};

db.version(2).stores({
  exercises: "id, name",
});
