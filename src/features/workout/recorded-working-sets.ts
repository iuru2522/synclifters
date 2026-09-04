import { useSyncExternalStore } from "react";

export type RecordedWorkingSet = {
  label: string;
  weight: string;
  reps: string;
};

let recordedWorkingSets: RecordedWorkingSet[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => {
    listener();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return recordedWorkingSets;
}

export function addRecordedWorkingSet(set: { weight: string; reps: string }) {
  recordedWorkingSets = [
    ...recordedWorkingSets,
    {
      label: String(recordedWorkingSets.length + 1),
      weight: set.weight,
      reps: set.reps,
    },
  ];
  emit();
}

export function useRecordedWorkingSets() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
