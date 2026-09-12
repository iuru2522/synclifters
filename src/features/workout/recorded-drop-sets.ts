import { useSyncExternalStore } from "react";
import type { SetFeeling } from "@/features/workout/types";

export type RecordedDropSet = {
  weight: string;
  reps: string;
  feeling: SetFeeling | null;
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

export function getRecordedDropSets() {
  return recordedDropSets;
}

export function setRecordedDropSets(
  drops: { weight: string; reps: string; feeling?: SetFeeling | null }[],
) {
  recordedDropSets = drops.map((drop) => ({
    weight: drop.weight,
    reps: drop.reps,
    feeling: drop.feeling ?? null,
  }));
  emit();
}

export function clearRecordedDropSets() {
  if (recordedDropSets.length === 0) {
    return;
  }

  recordedDropSets = [];
  emit();
}

export function useRecordedDropSets() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
