export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
}

export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
}

export interface ExerciseEntry {
  id: string;
  sessionId: string;
  exerciseId: string;
  sets: ExerciseSet[];
}

export interface Session {
  id: string;
  date: string;
}
