import { createSelectionStore } from "@/features/workout/selection-store";

const store = createSelectionStore<string | null>({
  initialValue: null,
  prepare: (value) => (value?.trim() ? value.trim() : null),
});

export const getSelectedExerciseImageUri = store.get;
export const setSelectedExerciseImageUri = store.set;
export const useSelectedExerciseImageUri = store.useStore;
