import { useSyncExternalStore } from "react";

let selectedImageUri: string | null = null;
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

export function getSelectedExerciseImageUri() {
  return selectedImageUri;
}

export function setSelectedExerciseImageUri(value: string) {
  selectedImageUri = value;
  emit();
}

export function useSelectedExerciseImageUri() {
  return useSyncExternalStore(subscribe, getSelectedExerciseImageUri, getSelectedExerciseImageUri);
}
