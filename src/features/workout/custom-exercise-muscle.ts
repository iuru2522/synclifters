import {
  MUSCLE_GROUP_OPTIONS,
  type MuscleGroup,
} from "@/features/workout/exercise-catalog";
import { createSelectionStore } from "@/features/workout/selection-store";

export { MUSCLE_GROUP_OPTIONS, type MuscleGroup };

const store = createSelectionStore<MuscleGroup | null>({
  initialValue: null,
});

export const getSelectedMuscleGroup = store.get;
export const setSelectedMuscleGroup = store.set;
export const useSelectedMuscleGroup = store.useStore;

export function formatMuscleGroupLabel(value: MuscleGroup | null) {
  if (!value) {
    return "Muscle";
  }

  return value;
}
