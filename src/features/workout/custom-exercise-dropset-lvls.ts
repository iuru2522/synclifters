import { createSelectionStore } from "@/features/workout/selection-store";

export const DROPSET_LVLS_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type DropsetLvlsOption = (typeof DROPSET_LVLS_OPTIONS)[number];

const store = createSelectionStore<DropsetLvlsOption | null>({
  initialValue: null,
});

export const getSelectedDropsetLvls = store.get;
export const setSelectedDropsetLvls = store.set;
export const useSelectedDropsetLvls = store.useStore;

export function formatDropsetLvlsLabel(value: DropsetLvlsOption | null) {
  if (!value) {
    return "Dropset lvls";
  }

  return String(value);
}
