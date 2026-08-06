import { CustomExerciseDropsetLvlsSheet } from "@/components/app/custom-exercise-dropset-lvls-sheet";
import {
  DROPSET_LVLS_OPTIONS,
  getSelectedDropsetLvls,
  setSelectedDropsetLvls,
} from "@/features/workout/custom-exercise-dropset-lvls";

export default function DropsetLvlsSheetScreen() {
  const initialValue = getSelectedDropsetLvls() ?? DROPSET_LVLS_OPTIONS[0];

  return (
    <CustomExerciseDropsetLvlsSheet
      initialValue={initialValue}
      onSave={async (lvls) => {
        setSelectedDropsetLvls(lvls);
      }}
    />
  );
}
