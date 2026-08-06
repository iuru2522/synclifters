import { CustomExerciseSupersetExerciseSheet } from "@/components/app/custom-exercise-superset-exercise-sheet";
import {
  getSelectedSupersetExercise,
  setSelectedSupersetExercise,
  SUPERSET_EXERCISE_OPTIONS,
} from "@/features/workout/custom-exercise-superset-exercise";

export default function SupersetExerciseSheetScreen() {
  const initialValue = getSelectedSupersetExercise() ?? SUPERSET_EXERCISE_OPTIONS[0];

  return (
    <CustomExerciseSupersetExerciseSheet
      initialValue={initialValue}
      onSave={async (exercise) => {
        setSelectedSupersetExercise(exercise);
      }}
    />
  );
}
