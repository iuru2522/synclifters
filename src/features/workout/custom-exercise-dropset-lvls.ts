import { useSyncExternalStore } from "react";

export const DROPSET_LVLS_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type DropsetLvlsOption = (typeof DROPSET_LVLS_OPTIONS)[number];

let selectedDropsetLvls: DropsetLvlsOption | null = null;
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

export function getSelectedDropsetLvls() {
  return selectedDropsetLvls;
}

export function setSelectedDropsetLvls(value: DropsetLvlsOption) {
  selectedDropsetLvls = value;
  emit();
}

export function formatDropsetLvlsLabel(value: DropsetLvlsOption | null) {
  if (!value) {
    return "Dropset lvls";
  }

  return String(value);
}

export function useSelectedDropsetLvls() {
  return useSyncExternalStore(subscribe, getSelectedDropsetLvls, getSelectedDropsetLvls);
}
