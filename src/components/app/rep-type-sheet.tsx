import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import {
  REP_TYPE_OPTIONS,
  type RepType,
} from "@/features/workout/rep-type-selection";

export type RepTypeSheetProps = {
  initialValue: RepType;
  onSave: (value: RepType) => Promise<void>;
};

export function RepTypeSheet({ initialValue, onSave }: RepTypeSheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={REP_TYPE_OPTIONS}
      accessibilityLabel="Rep type"
      onSave={onSave}
    />
  );
}
