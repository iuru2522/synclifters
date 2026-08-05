import { RepTypeSheet } from "@/components/app/rep-type-sheet";
import {
  getSelectedRepType,
  setSelectedRepType,
} from "@/features/workout/rep-type-selection";

export default function RepTypeSheetScreen() {
  const initialValue = getSelectedRepType() ?? "regular";

  return (
    <RepTypeSheet
      initialValue={initialValue}
      onSave={async (repType) => {
        setSelectedRepType(repType);
      }}
    />
  );
}
