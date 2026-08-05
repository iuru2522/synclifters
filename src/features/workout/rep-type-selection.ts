import { useSyncExternalStore } from "react";

export const REP_TYPE_OPTIONS = [
  { label: "DROPSET", value: "dropset" },
  { label: "SUPERSET", value: "superset" },
  { label: "REGULAR", value: "regular" },
] as const;

export type RepType = (typeof REP_TYPE_OPTIONS)[number]["value"];

let selectedRepType: RepType | null = null;
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

export function getSelectedRepType() {
  return selectedRepType;
}

export function setSelectedRepType(value: RepType) {
  selectedRepType = value;
  emit();
}

export function formatRepTypeLabel(value: RepType | null) {
  if (!value) {
    return "Rep type";
  }

  const match = REP_TYPE_OPTIONS.find((option) => option.value === value);
  return match?.label ?? "Rep type";
}

export function useSelectedRepType() {
  return useSyncExternalStore(subscribe, getSelectedRepType, getSelectedRepType);
}
