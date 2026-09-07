import type { EpochMillis } from "@/lib/firestore-timestamps";
import type { MeasureOption } from "@/features/workout/custom-exercise-measure";
import type { MuscleGroup } from "@/features/workout/custom-exercise-muscle";
import type { RepType } from "@/features/workout/rep-type-selection";

export type ExerciseSource = "catalog" | "custom";

export type ProgramExercise = {
  id: string;
  exerciseId: string;
  name: string;
  source: ExerciseSource;
  muscleGroup: MuscleGroup | string;
  measure: MeasureOption | string | null;
  repType: RepType | null;
  dropsetLvls: number | null;
  supersetExerciseName: string | null;
  imageUrl: string | null;
};

export type ProgramDay = {
  id: string;
  name: string;
  order: number;
  exercises: ProgramExercise[];
};

export type Program = {
  id: string;
  name: string;
  createdAt: EpochMillis | null;
  updatedAt: EpochMillis | null;
  days: ProgramDay[];
};

export type CustomExercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup | string;
  measure: MeasureOption | string | null;
  repType: RepType | null;
  dropsetLvls: number | null;
  supersetExerciseName: string | null;
  imageUrl: string | null;
  createdAt: EpochMillis | null;
};

export type SetFeeling = "W" | "EASY" | "GOOD" | "HARD" | "LIMIT";

export type SessionSetKind = "working" | "drop";

export type SessionSet = {
  kind: SessionSetKind;
  weight: number | null;
  reps: number | null;
  feeling: SetFeeling | null;
};

export type SessionExercise = {
  exerciseId: string;
  name: string;
  muscleGroup: MuscleGroup | string | null;
  sets: SessionSet[];
  totalVolume: number | null;
};

export type SessionStatus = "completed" | "in_progress";

export type WorkoutSession = {
  id: string;
  programId: string | null;
  programName: string;
  dayId: string | null;
  dayName: string;
  performedAt: EpochMillis | null;
  date: string;
  status: SessionStatus;
  exerciseIds: string[];
  exercises: SessionExercise[];
};

export type ActivityDay = {
  date: string;
  sessionCount: number;
};
