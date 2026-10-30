import { createSelectionStore } from "@/features/workout/selection-store";

export const MEASURE_OPTIONS = [
  "Weight and Repeats",
  "Distance and Time",
  "Time",
  "Distance",
  "Weight and Time",
] as const;

export type MeasureOption = (typeof MEASURE_OPTIONS)[number];

const store = createSelectionStore<MeasureOption | null>({
  initialValue: null,
});

export const getSelectedMeasure = store.get;
export const setSelectedMeasure = store.set;
export const useSelectedMeasure = store.useStore;

export function formatMeasureLabel(value: MeasureOption | null) {
  if (!value) {
    return "Measure";
  }

  return value;
}
