import type { Exercise } from "@/db/types";

export function groupExercisesByMuscle(exercises: Exercise[]): Record<string, Exercise[]> {
  return exercises.reduce<Record<string, typeof exercises>>((acc, ex) => {
    const group = ex.primaryMuscles[0];

    if (!acc[group]) acc[group] = [];

    acc[group].push(ex);

    return acc;
  }, {});
}
