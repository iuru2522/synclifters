import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import {
  SUPERSET_EXERCISE_OPTIONS,
  type SupersetExerciseOption,
} from "@/features/workout/custom-exercise-superset-exercise";

export type CustomExerciseSupersetExerciseSheetProps = {
  initialValue: SupersetExerciseOption;
  onSave: (value: SupersetExerciseOption) => Promise<void>;
};

export function CustomExerciseSupersetExerciseSheet({
  initialValue,
  onSave,
}: CustomExerciseSupersetExerciseSheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={SUPERSET_EXERCISE_OPTIONS}
      accessibilityLabel="Superset's Exercise"
      onSave={onSave}
    />
  );
}
