import { useSyncExternalStore } from "react";
import type { SetFeeling } from "@/features/workout/types";

export type RecordedWorkingSet = {
  label: string;
  weight: string;
  reps: string;
  feeling: SetFeeling | null;
};

const EMPTY_SETS: RecordedWorkingSet[] = [];

let recordedWorkingSetsByExercise: Record<string, RecordedWorkingSet[]> = {};
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

export function getRecordedWorkingSets(exerciseKey: string) {
  const key = normalizeKey(exerciseKey);
  if (!key) {
    return EMPTY_SETS;
  }

  return recordedWorkingSetsByExercise[key] ?? EMPTY_SETS;
}

export function addRecordedWorkingSet(
  exerciseKey: string,
  set: {
    weight: string;
    reps: string;
    feeling?: SetFeeling | null;
  },
) {
  const key = normalizeKey(exerciseKey);
  if (!key) {
    return;
  }

  const current = recordedWorkingSetsByExercise[key] ?? [];
  recordedWorkingSetsByExercise = {
    ...recordedWorkingSetsByExercise,
    [key]: [
      ...current,
      {
        label: String(current.length + 1),
        weight: set.weight,
        reps: set.reps,
        feeling: set.feeling ?? null,
      },
    ],
  };
  emit();
}

export function clearRecordedWorkingSets(exerciseKey?: string) {
  const key = exerciseKey == null ? "" : normalizeKey(exerciseKey);

  if (!key) {
    if (Object.keys(recordedWorkingSetsByExercise).length === 0) {
      return;
    }
    recordedWorkingSetsByExercise = {};
    emit();
    return;
  }

  if (!(key in recordedWorkingSetsByExercise)) {
    return;
  }

  const next = { ...recordedWorkingSetsByExercise };
  delete next[key];
  recordedWorkingSetsByExercise = next;
  emit();
}

export function useRecordedWorkingSets(exerciseKey: string) {
  const key = normalizeKey(exerciseKey);
  return useSyncExternalStore(
    subscribe,
    () => getRecordedWorkingSets(key),
    () => getRecordedWorkingSets(key),
  );
}
