import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import {
  activityDaysToDates,
  listActivityDays,
  listSessions,
} from "@/features/workout/session-repository";
import type { WorkoutSession } from "@/features/workout/types";

export type UserSessionsState = {
  sessions: WorkoutSession[];
  activityDates: Date[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useUserSessions(): UserSessionsState {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activityDates, setActivityDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setActivityDates([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [nextSessions, activityDays] = await Promise.all([
        listSessions(user.uid),
        listActivityDays(user.uid),
      ]);
      setSessions(nextSessions);
      setActivityDates(activityDaysToDates(activityDays));
    } catch (err) {
      setSessions([]);
      setActivityDates([]);
      setError(
        err instanceof Error ? err.message : "Failed to load workout history.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    sessions,
    activityDates,
    isLoading,
    error,
    refresh,
  };
}
