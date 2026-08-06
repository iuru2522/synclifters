import { useSyncExternalStore } from "react";

export const SUPERSET_EXERCISE_OPTIONS = [
  "Tricep Pushdown",
  "Skull Crushers",
  "Close Grip Bench Press",
  "Overhead Tricep Extension",
] as const;

export type SupersetExerciseOption = (typeof SUPERSET_EXERCISE_OPTIONS)[number];

let selectedSupersetExercise: SupersetExerciseOption | null = null;
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

export function getSelectedSupersetExercise() {
  return selectedSupersetExercise;
}

export function setSelectedSupersetExercise(value: SupersetExerciseOption) {
  selectedSupersetExercise = value;
  emit();
}

export function formatSupersetExerciseLabel(value: SupersetExerciseOption | null) {
  if (!value) {
    return "Superset's Exercise";
  }

  return value;
}

export function useSelectedSupersetExercise() {
  return useSyncExternalStore(
    subscribe,
    getSelectedSupersetExercise,
    getSelectedSupersetExercise,
  );
}
