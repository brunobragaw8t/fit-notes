import type { Exercise } from "@/db/types";

export function searchAndGroupExercises(
  exercises: Exercise[],
  search: string,
): Record<string, Exercise[]> {
  const searchLower = search.toLowerCase();

  return exercises.reduce<Record<string, typeof exercises>>((acc, ex) => {
    if (
      !ex.primaryMuscles[0].toLowerCase().includes(searchLower) &&
      !ex.name.toLowerCase().includes(searchLower)
    ) {
      return acc;
    }

    const group = ex.primaryMuscles[0];

    if (!acc[group]) acc[group] = [];

    acc[group].push(ex);

    return acc;
  }, {});
}
