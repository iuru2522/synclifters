import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import {
  clearExercisesByDay,
  type DayExercise,
} from "@/features/workout/day-exercises";
import {
  createProgram,
  listPrograms,
  setProgramFavorite,
} from "@/features/workout/program-repository";
import type { Program } from "@/features/workout/types";

export type UserProgramsState = {
  programs: Program[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleProgramFavorite: (programId: string) => Promise<void>;
};

function sortProgramsLocal(programs: Program[]): Program[] {
  return [...programs].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    return (b.createdAt ?? 0) - (a.createdAt ?? 0);
  });
}

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
      setPrograms(await listPrograms(user.uid));
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

  const toggleProgramFavorite = useCallback(
    async (programId: string) => {
      if (!user) {
        throw new Error("Sign in to favorite a program.");
      }

      const current = programs.find((program) => program.id === programId);
      if (!current) {
        return;
      }

      const nextFavorite = !current.isFavorite;
      const previous = programs;
      setPrograms(
        sortProgramsLocal(
          previous.map((program) => ({
            ...program,
            isFavorite: nextFavorite
              ? program.id === programId
              : program.id === programId
                ? false
                : program.isFavorite,
          })),
        ),
      );

      try {
        await setProgramFavorite(user.uid, programId, nextFavorite);
      } catch (err) {
        setPrograms(sortProgramsLocal(previous));
        throw err;
      }
    },
    [programs, user],
  );

  return {
    programs,
    isLoading,
    error,
    refresh,
    toggleProgramFavorite,
  };
}
