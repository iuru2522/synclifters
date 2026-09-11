import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import {
  clearExercisesByDay,
  type DayExercise,
} from "@/features/workout/day-exercises";
import {
  createProgram,
  listPrograms,
} from "@/features/workout/program-repository";
import type { Program } from "@/features/workout/types";

export type UserProgramsState = {
  programs: Program[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export async function saveUserProgram(input: {
  uid: string;
  name: string;
  dayNames: string[];
  exercisesByDay: Record<string, DayExercise[]>;
}): Promise<Program> {
  const program = await createProgram(input.uid, {
    name: input.name,
    days: input.dayNames.map((dayName) => ({
      name: dayName,
      exercises: [...(input.exercisesByDay[dayName] ?? [])],
    })),
  });

  clearExercisesByDay();
  return program;
}

export function useUserPrograms(): UserProgramsState {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setPrograms([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const next = await listPrograms(user.uid);
      setPrograms(next);
    } catch (err) {
      setPrograms([]);
      setError(
        err instanceof Error ? err.message : "Failed to load programs.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    programs,
    isLoading,
    error,
    refresh,
  };
}
