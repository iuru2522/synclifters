import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { listCustomExercises } from "@/features/workout/exercise-repository";
import {
  collectProgressExercises,
  exercisesForMuscleGroup,
  uniqueMuscleGroups,
  type ProgressExerciseRef,
} from "@/features/workout/progress-exercises";
import { listPrograms } from "@/features/workout/program-repository";
import { listSessions } from "@/features/workout/session-repository";

export type UserProgressExercisesState = {
  exercises: ProgressExerciseRef[];
  muscleGroups: string[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  exercisesForMuscle: (muscleGroup: string) => ProgressExerciseRef[];
};

export function useUserProgressExercises(): UserProgressExercisesState {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<ProgressExerciseRef[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const [programs, customExercises, sessions] = await Promise.all([
        listPrograms(user.uid),
        listCustomExercises(user.uid),
        listSessions(user.uid),
      ]);
      setExercises(
        collectProgressExercises({ programs, customExercises, sessions }),
      );
    } catch (err) {
      setExercises([]);
      setError(
        err instanceof Error ? err.message : "Failed to load progress exercises.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const muscleGroups = useMemo(() => uniqueMuscleGroups(exercises), [exercises]);

  const exercisesForMuscle = useCallback(
    (muscleGroup: string) => exercisesForMuscleGroup(exercises, muscleGroup),
    [exercises],
  );

  return {
    exercises,
    muscleGroups,
    isLoading,
    error,
    refresh,
    exercisesForMuscle,
  };
}
