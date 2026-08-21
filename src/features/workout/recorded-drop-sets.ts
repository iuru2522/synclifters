import { useSyncExternalStore } from "react";

export type RecordedDropSet = {
  weight: string;
  reps: string;
};

let recordedDropSets: RecordedDropSet[] = [];
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
  return recordedDropSets;
}

export function setRecordedDropSets(drops: RecordedDropSet[]) {
  recordedDropSets = drops.map((drop) => ({
    weight: drop.weight,
    reps: drop.reps,
  }));
  emit();
}

export function useRecordedDropSets() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
