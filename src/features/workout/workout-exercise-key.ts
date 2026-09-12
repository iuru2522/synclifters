import { catalogExerciseId } from "@/features/workout/day-exercises";

export function workoutExerciseKey(
  exerciseId?: string | null,
  exerciseName?: string | null,
): string {
  const id = exerciseId?.trim();
  if (id) {
    return id;
  }

  const name = exerciseName?.trim();
  if (!name) {
    return "";
  }

  return catalogExerciseId(name);
}
