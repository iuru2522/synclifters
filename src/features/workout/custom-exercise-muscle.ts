import { useSyncExternalStore } from "react";

export const MUSCLE_GROUP_OPTIONS = [
  "Triceps",
  "Biceps",
  "Chest",
  "Back",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUP_OPTIONS)[number];

let selectedMuscleGroup: MuscleGroup | null = null;
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

export function getSelectedMuscleGroup() {
  return selectedMuscleGroup;
}

export function setSelectedMuscleGroup(value: MuscleGroup | null) {
  selectedMuscleGroup = value;
  emit();
}

export function formatMuscleGroupLabel(value: MuscleGroup | null) {
  if (!value) {
    return "Muscle";
  }

  return value;
}

export function useSelectedMuscleGroup() {
  return useSyncExternalStore(subscribe, getSelectedMuscleGroup, getSelectedMuscleGroup);
}
