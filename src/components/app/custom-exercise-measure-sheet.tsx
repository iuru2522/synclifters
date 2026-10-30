import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import {
  MEASURE_OPTIONS,
  type MeasureOption,
} from "@/features/workout/custom-exercise-measure";

export type CustomExerciseMeasureSheetProps = {
  initialValue: MeasureOption;
  onSave: (value: MeasureOption) => Promise<void>;
};

export function CustomExerciseMeasureSheet({
  initialValue,
  onSave,
}: CustomExerciseMeasureSheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={MEASURE_OPTIONS}
      accessibilityLabel="Measure"
      onSave={onSave}
    />
  );
}
