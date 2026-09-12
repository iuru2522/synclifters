import type { SessionExercise, SessionSet, WorkoutSession } from "@/features/workout/types";

export function formatSessionDate(session: WorkoutSession): string {
  if (session.performedAt != null) {
    return new Date(session.performedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return session.date;
}

export function formatSetsSummary(sets: SessionSet[]): string {
  return sets
    .filter((set) => set.weight != null || set.reps != null)
    .map((set) => {
      const weight = set.weight != null ? String(set.weight) : "-";
      const reps = set.reps != null ? String(set.reps) : "-";
      return `${weight}X${reps}`;
    })
    .join(", ");
}

export function formatVolumeLabel(totalVolume: number | null): string {
  if (totalVolume == null) {
    return "";
  }

  return `${totalVolume} Kgs`;
}

export function formatSessionProgramLabel(session: WorkoutSession): string {
  return `${session.dayName} - ${session.programName}`;
}

export function findSessionExercise(
  session: WorkoutSession,
  exerciseId: string,
): SessionExercise | null {
  const trimmed = exerciseId.trim();
  if (!trimmed) {
    return null;
  }

  return (
    session.exercises.find((exercise) => exercise.exerciseId === trimmed) ?? null
  );
}
