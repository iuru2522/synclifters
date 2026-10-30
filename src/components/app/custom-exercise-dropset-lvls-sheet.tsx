import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import {
  DROPSET_LVLS_OPTIONS,
  type DropsetLvlsOption,
} from "@/features/workout/custom-exercise-dropset-lvls";

export type CustomExerciseDropsetLvlsSheetProps = {
  initialValue: DropsetLvlsOption;
  onSave: (value: DropsetLvlsOption) => Promise<void>;
};

export function CustomExerciseDropsetLvlsSheet({
  initialValue,
  onSave,
}: CustomExerciseDropsetLvlsSheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={DROPSET_LVLS_OPTIONS}
      accessibilityLabel="Dropset lvls"
      onSave={onSave}
    />
  );
}
