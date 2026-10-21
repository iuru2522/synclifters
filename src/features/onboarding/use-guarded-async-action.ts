import { useCallback, useRef } from "react";

export function useGuardedAsyncAction() {
  const busyRef = useRef(false);

  return useCallback(async (action: () => Promise<void>) => {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;

    try {
      await action();
    } finally {
      busyRef.current = false;
    }
  }, []);
}
