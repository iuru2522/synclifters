import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { getProgram } from "@/features/workout/program-repository";
import { getSession } from "@/features/workout/session-repository";
import type { ProgramExercise, SessionExercise } from "@/features/workout/types";

export type DayExerciseListItem = {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroup: string | null;
};

export type ProgramDayExercisesState = {
  exercises: DayExerciseListItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function mapProgramExercises(items: ProgramExercise[]): DayExerciseListItem[] {
  return items
    .filter((item) => item.name.trim())
    .map((item) => ({
      id: item.id,
      exerciseId: item.exerciseId,
      name: item.name,
      muscleGroup:
        typeof item.muscleGroup === "string" && item.muscleGroup.trim()
          ? item.muscleGroup
          : null,
    }));
}

function mapSessionExercises(items: SessionExercise[]): DayExerciseListItem[] {
  return items
    .filter((item) => item.name.trim())
    .map((item, index) => ({
      id: `${item.exerciseId}-${index}`,
      exerciseId: item.exerciseId,
      name: item.name,
      muscleGroup:
        typeof item.muscleGroup === "string" && item.muscleGroup.trim()
          ? item.muscleGroup
          : null,
    }));
}

function findDayExercises(
  days: { name: string; exercises: ProgramExercise[] }[],
  dayName: string,
): ProgramExercise[] {
  const trimmed = dayName.trim().toLowerCase();
  const match = days.find((day) => day.name.trim().toLowerCase() === trimmed);
  return match?.exercises ?? [];
}

export function useProgramDayExercises(input: {
  programId?: string | null;
  dayName?: string | null;
  sessionId?: string | null;
  fromHistory: boolean;
}): ProgramDayExercisesState {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<DayExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const programId = input.programId?.trim() || "";
  const dayName = input.dayName?.trim() || "";
  const sessionId = input.sessionId?.trim() || "";
  const fromHistory = input.fromHistory;

  const refresh = useCallback(async () => {
    if (!user) {
      setExercises([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (fromHistory) {
        if (!sessionId) {
          setExercises([]);
          setError("Missing workout session.");
          return;
        }

        const session = await getSession(user.uid, sessionId);
        if (!session) {
          setExercises([]);
          setError("Workout session not found.");
          return;
        }

        setExercises(mapSessionExercises(session.exercises));
        return;
      }

      if (!programId) {
        setExercises([]);
        setError(null);
        return;
      }

      const program = await getProgram(user.uid, programId);
      if (!program) {
        setExercises([]);
        setError("Program not found.");
        return;
      }

      setExercises(mapProgramExercises(findDayExercises(program.days, dayName)));
    } catch (err) {
      setExercises([]);
      setError(
        err instanceof Error ? err.message : "Failed to load exercises.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [dayName, fromHistory, programId, sessionId, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    exercises,
    isLoading,
    error,
    refresh,
  };
}
