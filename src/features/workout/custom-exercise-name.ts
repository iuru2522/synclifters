import { useSyncExternalStore } from "react";

let selectedExerciseName: string | null = null;
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

export function getSelectedExerciseName() {
  return selectedExerciseName;
}

export function setSelectedExerciseName(value: string | null) {
  selectedExerciseName = value?.trim() ? value.trim() : null;
  emit();
}

export function formatExerciseNameLabel(value: string | null) {
  if (!value?.trim()) {
    return "Exercise Name";
  }

  return value.trim();
}

export function useSelectedExerciseName() {
  return useSyncExternalStore(subscribe, getSelectedExerciseName, getSelectedExerciseName);
}
