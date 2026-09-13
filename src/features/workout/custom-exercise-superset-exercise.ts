import { useSyncExternalStore } from "react";
import { catalogExerciseNames } from "@/features/workout/exercise-catalog";

export const SUPERSET_EXERCISE_OPTIONS = catalogExerciseNames();

export type SupersetExerciseOption = string;

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

export function setSelectedSupersetExercise(value: SupersetExerciseOption | null) {
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
