import { useSyncExternalStore } from "react";
import type { SetFeeling } from "@/features/workout/types";

export type RecordedWorkingSet = {
  label: string;
  weight: string;
  reps: string;
  feeling: SetFeeling | null;
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

export function getRecordedWorkingSets() {
  return recordedWorkingSets;
}

export function addRecordedWorkingSet(set: {
  weight: string;
  reps: string;
  feeling?: SetFeeling | null;
}) {
  recordedWorkingSets = [
    ...recordedWorkingSets,
    {
      label: String(recordedWorkingSets.length + 1),
      weight: set.weight,
      reps: set.reps,
      feeling: set.feeling ?? null,
    },
  ];
  emit();
}

export function clearRecordedWorkingSets() {
  if (recordedWorkingSets.length === 0) {
    return;
  }

  recordedWorkingSets = [];
  emit();
}

export function useRecordedWorkingSets() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
