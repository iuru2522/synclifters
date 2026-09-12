import { useSyncExternalStore } from "react";
import type { SetFeeling } from "@/features/workout/types";

export type RecordedDropSet = {
  weight: string;
  reps: string;
  feeling: SetFeeling | null;
};

const EMPTY_SETS: RecordedDropSet[] = [];

let recordedDropSetsByExercise: Record<string, RecordedDropSet[]> = {};
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

function normalizeKey(exerciseKey: string) {
  return exerciseKey.trim();
}

export function getRecordedDropSets(exerciseKey: string) {
  const key = normalizeKey(exerciseKey);
  if (!key) {
    return EMPTY_SETS;
  }

  return recordedDropSetsByExercise[key] ?? EMPTY_SETS;
}

export function setRecordedDropSets(
  exerciseKey: string,
  drops: { weight: string; reps: string; feeling?: SetFeeling | null }[],
) {
  const key = normalizeKey(exerciseKey);
  if (!key) {
    return;
  }

  recordedDropSetsByExercise = {
    ...recordedDropSetsByExercise,
    [key]: drops.map((drop) => ({
      weight: drop.weight,
      reps: drop.reps,
      feeling: drop.feeling ?? null,
    })),
  };
  emit();
}

export function clearRecordedDropSets(exerciseKey?: string) {
  const key = exerciseKey == null ? "" : normalizeKey(exerciseKey);

  if (!key) {
    if (Object.keys(recordedDropSetsByExercise).length === 0) {
      return;
    }
    recordedDropSetsByExercise = {};
    emit();
    return;
  }

  if (!(key in recordedDropSetsByExercise)) {
    return;
  }

  const next = { ...recordedDropSetsByExercise };
  delete next[key];
  recordedDropSetsByExercise = next;
  emit();
}

export function useRecordedDropSets(exerciseKey: string) {
  const key = normalizeKey(exerciseKey);
  return useSyncExternalStore(
    subscribe,
    () => getRecordedDropSets(key),
    () => getRecordedDropSets(key),
  );
}
