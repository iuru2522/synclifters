import { Text, View } from "react-native";
import { AppButton } from "@/components/app-button";
import {
  findSessionExercise,
  formatSessionDate,
  formatSessionProgramLabel,
  formatSetsSummary,
  formatVolumeLabel,
} from "@/features/workout/session-display";
import type { WorkoutSession } from "@/features/workout/types";
import { colors, globalStyles, sizes } from "@/styles/global";

type ExerciseSessionHistoryListProps = {
  sessions: WorkoutSession[];
  exerciseId: string;
  isLoading: boolean;
  error: string | null;
};

export function ExerciseSessionHistoryList({
  sessions,
  exerciseId,
  isLoading,
  error,
}: ExerciseSessionHistoryListProps) {
  return (
    <>
      <Text style={globalStyles.exerciseHistoryLabel}>HISTORY</Text>
      {isLoading ? null : error ? (
        <Text style={globalStyles.workoutMyPrograms}>{error}</Text>
      ) : sessions.length === 0 ? (
        <Text style={globalStyles.workoutMyPrograms}>No history yet</Text>
      ) : (
        <View style={globalStyles.exerciseHistoryButtonsRow}>
          {sessions.map((session) => {
            const exercise = findSessionExercise(session, exerciseId);
            const dateLabel = formatSessionDate(session);
            const programLabel = formatSessionProgramLabel(session);
            const setsLabel = exercise ? formatSetsSummary(exercise.sets) : "";
            const volumeLabel = exercise
              ? formatVolumeLabel(exercise.totalVolume)
              : "";

            return (
              <AppButton
                key={session.id}
                title=""
                onPress={() => {}}
                borderColor={colors.backArrow}
                borderWidth={sizes.workoutProgramThinBorderWidth}
                textColor={colors.inputFill}
                pressAccentColor={colors.backArrow}
                textStyle={globalStyles.exerciseHistoryButtonSpacer}
                leftIcon={
                  <View style={globalStyles.exerciseHistoryButtonContent}>
                    <View style={globalStyles.exerciseHistoryButtonRow}>
                      <Text style={globalStyles.exerciseHistoryButtonDate}>
                        {dateLabel}
                      </Text>
                      <Text style={globalStyles.exerciseHistoryButtonProgram}>
                        {programLabel}
                      </Text>
                    </View>
                    <View style={globalStyles.exerciseHistoryButtonRow}>
                      <Text style={globalStyles.exerciseHistoryButtonDate}>
                        {setsLabel}
                      </Text>
                      <Text style={globalStyles.exerciseHistoryButtonWeight}>
                        {volumeLabel}
                      </Text>
                    </View>
                  </View>
                }
                style={[
                  globalStyles.workoutCreateProgramThinBorder,
                  globalStyles.exerciseHistoryButton,
                ]}
                accessibilityLabel={`${dateLabel}, ${setsLabel}, ${programLabel}, ${volumeLabel}`}
              />
            );
          })}
        </View>
      )}
    </>
  );
}
