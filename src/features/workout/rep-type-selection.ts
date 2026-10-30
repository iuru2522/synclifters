import { createSelectionStore } from "@/features/workout/selection-store";

export const REP_TYPE_OPTIONS = [
  { label: "Regular", value: "regular" },
  { label: "Superset", value: "superset" },
  { label: "Dropset", value: "dropset" },
] as const;

export type RepType = (typeof REP_TYPE_OPTIONS)[number]["value"];

const store = createSelectionStore<RepType | null>({
  initialValue: "regular",
});

export const getSelectedRepType = store.get;
export const useSelectedRepType = store.useStore;

export function setSelectedRepType(value: RepType) {
  store.set(value);
}

export function formatRepTypeLabel(value: RepType | null) {
  if (!value) {
    return "Rep type";
  }

  const match = REP_TYPE_OPTIONS.find((option) => option.value === value);
  return match?.label ?? "Rep type";
}
