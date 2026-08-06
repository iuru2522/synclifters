import { CustomExerciseMeasureSheet } from "@/components/app/custom-exercise-measure-sheet";
import {
  getSelectedMeasure,
  MEASURE_OPTIONS,
  setSelectedMeasure,
} from "@/features/workout/custom-exercise-measure";

export default function MeasureSheetScreen() {
  const initialValue = getSelectedMeasure() ?? MEASURE_OPTIONS[0];

  return (
    <CustomExerciseMeasureSheet
      initialValue={initialValue}
      onSave={async (measure) => {
        setSelectedMeasure(measure);
      }}
    />
  );
}
