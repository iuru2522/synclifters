import { createSelectionStore } from "@/features/workout/selection-store";

const store = createSelectionStore<string | null>({
  initialValue: null,
  prepare: (value) => (value?.trim() ? value.trim() : null),
});

export const getSelectedExerciseName = store.get;
export const setSelectedExerciseName = store.set;
export const useSelectedExerciseName = store.useStore;

export function formatExerciseNameLabel(value: string | null) {
  if (!value?.trim()) {
    return "Exercise Name";
  }

  return value.trim();
}
