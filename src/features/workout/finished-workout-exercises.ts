import { useSyncExternalStore } from "react";

let finishedExerciseKeys = new Set<string>();
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

export function hasFinishedAnyWorkoutExercise() {
  return finishedExerciseKeys.size > 0;
}

export function markWorkoutExerciseFinished(exerciseKey: string) {
  const key = normalizeKey(exerciseKey);
  if (!key || finishedExerciseKeys.has(key)) {
    return;
  }

  finishedExerciseKeys = new Set(finishedExerciseKeys);
  finishedExerciseKeys.add(key);
  emit();
}

export function clearFinishedWorkoutExercises() {
  if (finishedExerciseKeys.size === 0) {
    return;
  }

  finishedExerciseKeys = new Set();
  emit();
}

export function useHasFinishedAnyWorkoutExercise() {
  return useSyncExternalStore(
    subscribe,
    hasFinishedAnyWorkoutExercise,
    hasFinishedAnyWorkoutExercise,
  );
}
