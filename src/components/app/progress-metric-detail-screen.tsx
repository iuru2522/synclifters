import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { readSearchParam } from "@/components/app/program-day-params";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { catalogExerciseId } from "@/features/workout/day-exercises";
import {
  findSessionExercise,
  formatSessionDate,
  formatSessionProgramLabel,
  formatSetsSummary,
  formatVolumeLabel,
} from "@/features/workout/session-display";
import { useExerciseSessionHistory } from "@/features/workout/user-exercise-history";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function ProgressMetricDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    exerciseId?: string | string[];
    exerciseName?: string | string[];
  }>();
  const exerciseName = readSearchParam(params.exerciseName) ?? "";
  const exerciseId =
    readSearchParam(params.exerciseId) ||
    (exerciseName ? catalogExerciseId(exerciseName) : "");
  const title = exerciseName ? exerciseName.toUpperCase() : "EXERCISE";
  const { sessions, isLoading, error, refresh } = useExerciseSessionHistory(exerciseId);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <View
      style={[
        globalStyles.createProgramScreen,
        {
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
        },
      ]}
    >
      <View style={globalStyles.createDayHeader}>
        <View style={globalStyles.createDayHeaderBack}>
          <AuthBackButton
            title=""
            onPress={() => {
              router.back();
            }}
          />
        </View>
        <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
          {title}
        </Text>
        <Pressable
          style={globalStyles.createDayHeaderMenu}
          onPress={() => {}}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Menu"
        >
          <CreateDayBurgerIcon />
        </Pressable>
      </View>

      <ScrollView
        style={globalStyles.progressMetricScroll}
        contentContainerStyle={globalStyles.progressMetricDetailScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.progressMetricDiagramWrap}>
          <WorkoutGlassCard style={globalStyles.progressMetricDiagram}>
            <Text style={globalStyles.progressMetricDiagramLabel}>diagram</Text>
          </WorkoutGlassCard>
        </View>

        <Text style={globalStyles.exerciseHistoryLabel}>HISTORY</Text>
        {isLoading ? (
          <Text style={globalStyles.workoutMyPrograms}>Loading history…</Text>
        ) : null}
        {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
        {!isLoading && !error && sessions.length === 0 ? (
          <Text style={globalStyles.workoutMyPrograms}>No history yet</Text>
        ) : null}
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
      </ScrollView>
    </View>
  );
}

export const PROGRESS_METRIC_DETAIL_HREF = "/workout/progress-metric-detail" as Href;
