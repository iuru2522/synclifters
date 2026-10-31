import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

/**
 * Refetch when the screen gains focus (including first focus / mount).
 *
 * Do not also call the same refresh from a mount-only `useEffect` — that
 * double-fetches because `useFocusEffect` already runs on initial focus.
 */
export function useRefreshOnFocus(
  refresh: () => void | Promise<void>,
): void {
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
}
