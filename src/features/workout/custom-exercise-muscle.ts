import { useSyncExternalStore } from "react";
import {
  MUSCLE_GROUP_OPTIONS,
  type MuscleGroup,
} from "@/features/workout/exercise-catalog";

export { MUSCLE_GROUP_OPTIONS, type MuscleGroup };

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
