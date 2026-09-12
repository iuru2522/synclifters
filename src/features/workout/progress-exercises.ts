import type { CustomExercise, Program, WorkoutSession } from "@/features/workout/types";

export type ProgressExerciseRef = {
  exerciseId: string;
  name: string;
  muscleGroup: string;
};

function normalizeMuscleGroup(value: string | null | undefined): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function upsertExercise(
  byId: Map<string, ProgressExerciseRef>,
  exercise: ProgressExerciseRef,
) {
  const existing = byId.get(exercise.exerciseId);
  if (!existing) {
    byId.set(exercise.exerciseId, exercise);
    return;
  }

  // Prefer a non-empty newer name if the prior one differs only by casing/spaces.
  if (exercise.name.trim() && existing.name !== exercise.name) {
    byId.set(exercise.exerciseId, {
      ...existing,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup || existing.muscleGroup,
    });
  }
}

export function collectProgressExercises(input: {
  programs: Program[];
  customExercises: CustomExercise[];
  sessions: WorkoutSession[];
}): ProgressExerciseRef[] {
  const byId = new Map<string, ProgressExerciseRef>();

  for (const program of input.programs) {
    for (const day of program.days) {
      for (const exercise of day.exercises) {
        const muscleGroup = normalizeMuscleGroup(exercise.muscleGroup);
        if (!muscleGroup || !exercise.exerciseId.trim() || !exercise.name.trim()) {
          continue;
        }

        upsertExercise(byId, {
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          muscleGroup,
        });
      }
    }
  }

  for (const exercise of input.customExercises) {
    const muscleGroup = normalizeMuscleGroup(exercise.muscleGroup);
    if (!muscleGroup || !exercise.id.trim() || !exercise.name.trim()) {
      continue;
    }

    upsertExercise(byId, {
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroup,
    });
  }

  for (const session of input.sessions) {
    for (const exercise of session.exercises) {
      const muscleGroup = normalizeMuscleGroup(exercise.muscleGroup);
      if (!muscleGroup || !exercise.exerciseId.trim() || !exercise.name.trim()) {
        continue;
      }

      upsertExercise(byId, {
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        muscleGroup,
      });
    }
  }

  return [...byId.values()].sort((a, b) => {
    const muscleCompare = a.muscleGroup.localeCompare(b.muscleGroup);
    if (muscleCompare !== 0) {
      return muscleCompare;
    }

    return a.name.localeCompare(b.name);
  });
}

export function uniqueMuscleGroups(exercises: ProgressExerciseRef[]): string[] {
  const groups = new Set<string>();
  for (const exercise of exercises) {
    groups.add(exercise.muscleGroup);
  }

  return [...groups].sort((a, b) => a.localeCompare(b));
}

export function exercisesForMuscleGroup(
  exercises: ProgressExerciseRef[],
  muscleGroup: string,
): ProgressExerciseRef[] {
  const trimmed = muscleGroup.trim().toLowerCase();
  return exercises.filter(
    (exercise) => exercise.muscleGroup.trim().toLowerCase() === trimmed,
  );
}
