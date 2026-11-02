import { useCallback, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import {
  findSessionExercise,
  mapSessionSetsToDisplay,
  type SessionDisplaySet,
} from "@/features/workout/session-display";
import { getSession } from "@/features/workout/session-repository";

export type HistoryExerciseSetsState = {
  workingSets: SessionDisplaySet[];
  dropSets: SessionDisplaySet[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const EMPTY_SETS: SessionDisplaySet[] = [];

export function useHistoryExerciseSets(input: {
  enabled: boolean;
  sessionId?: string | null;
  exerciseId?: string | null;
}): HistoryExerciseSetsState {
  const { user } = useAuth();
  const [workingSets, setWorkingSets] = useState<SessionDisplaySet[]>(EMPTY_SETS);
  const [dropSets, setDropSets] = useState<SessionDisplaySet[]>(EMPTY_SETS);
  const [isLoading, setIsLoading] = useState(input.enabled);
  const [error, setError] = useState<string | null>(null);
  const sessionId = input.sessionId?.trim() || "";
  const exerciseId = input.exerciseId?.trim() || "";
  const enabled = input.enabled;

  const refresh = useCallback(async () => {
    if (!enabled) {
      setWorkingSets(EMPTY_SETS);
      setDropSets(EMPTY_SETS);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!user) {
      setWorkingSets(EMPTY_SETS);
      setDropSets(EMPTY_SETS);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!sessionId || !exerciseId) {
      setWorkingSets(EMPTY_SETS);
      setDropSets(EMPTY_SETS);
      setError("Missing workout session.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const session = await getSession(user.uid, sessionId);
      if (!session) {
        setWorkingSets(EMPTY_SETS);
        setDropSets(EMPTY_SETS);
        setError("Workout session not found.");
        return;
      }

      const exercise = findSessionExercise(session, exerciseId);
      if (!exercise) {
        setWorkingSets(EMPTY_SETS);
        setDropSets(EMPTY_SETS);
        setError("Exercise not found in this workout.");
        return;
      }

      const mapped = mapSessionSetsToDisplay(exercise.sets);
      setWorkingSets(mapped.workingSets);
      setDropSets(mapped.dropSets);
    } catch (err) {
      setWorkingSets(EMPTY_SETS);
      setDropSets(EMPTY_SETS);
      setError(err instanceof Error ? err.message : "Failed to load workout sets.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, exerciseId, sessionId, user]);

  return {
    workingSets,
    dropSets,
    isLoading,
    error,
    refresh,
  };
}
