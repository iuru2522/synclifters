import { ProfileFieldSheet } from "@/components/app/profile-field-sheet";
import {
  getSelectedExerciseName,
  setSelectedExerciseName,
} from "@/features/workout/custom-exercise-name";

export default function ExerciseNameSheetScreen() {
  return (
    <ProfileFieldSheet
      label="Exercise Name"
      placeholder="exercise name"
      initialValue={getSelectedExerciseName() ?? ""}
      autoCapitalize="words"
      emptyErrorTitle="Exercise name required"
      emptyErrorMessage="Please enter an exercise name."
      onSave={async (trimmedName) => {
        setSelectedExerciseName(trimmedName);
      }}
    />
  );
}
