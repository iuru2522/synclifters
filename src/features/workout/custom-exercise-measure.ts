import { useSyncExternalStore } from "react";

export const MEASURE_OPTIONS = [
  "Weight and Repeats",
  "Distance and Time",
  "Time",
  "Distance",
  "Weight and Time",
] as const;

export type MeasureOption = (typeof MEASURE_OPTIONS)[number];

let selectedMeasure: MeasureOption | null = null;
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

export function getSelectedMeasure() {
  return selectedMeasure;
}

export function setSelectedMeasure(value: MeasureOption | null) {
  selectedMeasure = value;
  emit();
}

export function formatMeasureLabel(value: MeasureOption | null) {
  if (!value) {
    return "Measure";
  }

  return value;
}

export function useSelectedMeasure() {
  return useSyncExternalStore(subscribe, getSelectedMeasure, getSelectedMeasure);
}
