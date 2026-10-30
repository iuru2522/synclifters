import { catalogExerciseNames } from "@/features/workout/exercise-catalog";
import { createSelectionStore } from "@/features/workout/selection-store";

export const SUPERSET_EXERCISE_OPTIONS = catalogExerciseNames();

export type SupersetExerciseOption = string;

const store = createSelectionStore<SupersetExerciseOption | null>({
  initialValue: null,
});

export const getSelectedSupersetExercise = store.get;
export const setSelectedSupersetExercise = store.set;
export const useSelectedSupersetExercise = store.useStore;

export function formatSupersetExerciseLabel(value: SupersetExerciseOption | null) {
  if (!value) {
    return "Superset's Exercise";
  }

  return value;
}
