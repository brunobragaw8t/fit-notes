export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
}

// ExerciseSet instead of Set
// to prevent name collision with JavaScript's Set
export interface ExerciseSet {
  id: string;
  entryId: string;
  order: number;
  weight: number;
  reps: number;
}

export interface ExerciseEntry {
  id: string;
  sessionId: string;
  exerciseId: string;
  order: number;
}

export interface Session {
  id: string;
  date: string;
}
