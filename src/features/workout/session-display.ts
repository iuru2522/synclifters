import type { SessionExercise, SessionSet, WorkoutSession } from "@/features/workout/types";

export function formatShortSessionDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLastWorkoutDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

export function formatSessionDate(session: WorkoutSession): string {
  if (session.performedAt != null) {
    return formatShortSessionDate(session.performedAt);
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

export type SessionDisplaySet = {
  label: string;
  weight: string;
  reps: string;
};

function formatSetValue(value: number | null): string {
  return value != null ? String(value) : "-";
}

export function mapSessionSetsToDisplay(sets: SessionSet[]): {
  workingSets: SessionDisplaySet[];
  dropSets: SessionDisplaySet[];
} {
  const workingSets: SessionDisplaySet[] = [];
  const dropSets: SessionDisplaySet[] = [];

  for (const set of sets) {
    const row = {
      weight: formatSetValue(set.weight),
      reps: formatSetValue(set.reps),
    };

    if (set.kind === "drop") {
      dropSets.push({
        ...row,
        label: `D${dropSets.length + 1}`,
      });
      continue;
    }

    workingSets.push({
      ...row,
      label: String(workingSets.length + 1),
    });
  }

  return { workingSets, dropSets };
}
