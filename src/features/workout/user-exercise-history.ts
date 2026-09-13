import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { listSessionsForExercise } from "@/features/workout/session-repository";
import type { WorkoutSession } from "@/features/workout/types";

export type ExerciseSessionHistoryState = {
  sessions: WorkoutSession[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useExerciseSessionHistory(
  exerciseId: string | null | undefined,
): ExerciseSessionHistoryState {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const trimmedId = exerciseId?.trim() || "";

  const refresh = useCallback(async () => {
    if (!user || !trimmedId) {
      setSessions([]);
      setError(null);
      setIsLoading(false);
      hasLoadedRef.current = true;
      return;
    }

    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      setSessions(await listSessionsForExercise(user.uid, trimmedId));
    } catch (err) {
      setSessions([]);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load exercise history.",
      );
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [trimmedId, user]);

  useEffect(() => {
    hasLoadedRef.current = false;
    setSessions([]);
    setError(null);
    setIsLoading(Boolean(user && trimmedId));
    void refresh();
  }, [refresh]);

  return {
    sessions,
    isLoading,
    error,
    refresh,
  };
}
