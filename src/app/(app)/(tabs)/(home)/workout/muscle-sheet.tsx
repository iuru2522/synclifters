import { CustomExerciseMuscleSheet } from "@/components/app/custom-exercise-muscle-sheet";
import {
  getSelectedMuscleGroup,
  MUSCLE_GROUP_OPTIONS,
  setSelectedMuscleGroup,
} from "@/features/workout/custom-exercise-muscle";

export default function MuscleSheetScreen() {
  const initialValue = getSelectedMuscleGroup() ?? MUSCLE_GROUP_OPTIONS[0];

  return (
    <CustomExerciseMuscleSheet
      initialValue={initialValue}
      onSave={async (muscleGroup) => {
        setSelectedMuscleGroup(muscleGroup);
      }}
    />
  );
}
