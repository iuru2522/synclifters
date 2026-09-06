import { readSearchParam } from "@/components/app/program-day-params";
import { ProfileFieldSheet } from "@/components/app/profile-field-sheet";
import {
  getHistoryDayRecord,
  renameHistoryDayRecord,
} from "@/features/workout/history-day-records";
import { useLocalSearchParams } from "expo-router";

export default function HistoryExerciseNameSheetScreen() {
  const params = useLocalSearchParams<{
    programName?: string | string[];
    dayName?: string | string[];
    recordId?: string | string[];
  }>();
  const programName = readSearchParam(params.programName) ?? "";
  const dayName = readSearchParam(params.dayName) ?? "";
  const recordId = readSearchParam(params.recordId) ?? "";
  const initialValue = getHistoryDayRecord(programName, dayName, recordId)?.name ?? "";

  return (
    <ProfileFieldSheet
      label="Exercise Name"
      placeholder="exercise name"
      initialValue={initialValue}
      autoCapitalize="words"
      emptyErrorTitle="Exercise name required"
      emptyErrorMessage="Please enter an exercise name."
      onSave={async (trimmedName) => {
        renameHistoryDayRecord(programName, dayName, recordId, trimmedName);
      }}
    />
  );
}
