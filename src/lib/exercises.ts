import { db } from "@/db/db";
import type { Exercise } from "@/db/types";
import exerciseData from "./exercises.json";

const exercisesToSeed = exerciseData as Exercise[];

export async function seedExercises() {
  const count = await db.exercises.count();

  if (count > 0) return;

  const exercises = exercisesToSeed.map((ex) => ({
    id: ex.id,
    name: ex.name,
    primaryMuscles: ex.primaryMuscles,
  }));

  await db.exercises.bulkAdd(exercises);
}
