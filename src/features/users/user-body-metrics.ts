import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { listBodyMetrics } from "@/features/users/body-metrics-repository";
import type { BodyMetricEntry, BodyMetricType } from "@/features/users/types";

export type UserBodyMetricsState = {
  entries: BodyMetricEntry[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useUserBodyMetrics(type: BodyMetricType): UserBodyMetricsState {
  const { user } = useAuth();
  const [entries, setEntries] = useState<BodyMetricEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setEntries(await listBodyMetrics(user.uid, type));
    } catch (err) {
      setEntries([]);
      setError(
        err instanceof Error ? err.message : "Failed to load body metrics.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [type, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    entries,
    isLoading,
    error,
    refresh,
  };
}
