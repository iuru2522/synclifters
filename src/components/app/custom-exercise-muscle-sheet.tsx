import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import {
  MUSCLE_GROUP_OPTIONS,
  type MuscleGroup,
} from "@/features/workout/custom-exercise-muscle";

export type CustomExerciseMuscleSheetProps = {
  initialValue: MuscleGroup;
  onSave: (value: MuscleGroup) => Promise<void>;
};

export function CustomExerciseMuscleSheet({
  initialValue,
  onSave,
}: CustomExerciseMuscleSheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={MUSCLE_GROUP_OPTIONS}
      accessibilityLabel="Muscle"
      onSave={onSave}
    />
  );
}
