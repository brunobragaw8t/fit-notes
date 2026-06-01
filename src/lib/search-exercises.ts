import type { Exercise } from "@/db/types";

export function searchExercises(exercises: Exercise[], search: string) {
  const searchLower = search.toLowerCase();

  return exercises.filter((ex) => {
    return (
      ex.primaryMuscles[0].toLowerCase().includes(searchLower) ||
      ex.name.toLowerCase().includes(searchLower)
    );
  });
}
