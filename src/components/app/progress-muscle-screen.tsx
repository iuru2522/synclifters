import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { readSearchParam } from "@/components/app/program-day-params";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useUserProgressExercises } from "@/features/workout/user-progress-exercises";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { colors, globalStyles, spacing } from "@/styles/global";

const PROGRESS_METRIC_DETAIL_HREF = "/progress/progress-metric-detail" as Href;

export function ProgressMuscleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    muscleGroup?: string | string[];
  }>();
  const muscleGroup = readSearchParam(params.muscleGroup) ?? "";
  const { isLoading, error, refresh, exercisesForMuscle } = useUserProgressExercises();
  const exercises = useMemo(
    () => (muscleGroup ? exercisesForMuscle(muscleGroup) : []),
    [exercisesForMuscle, muscleGroup],
  );

  useRefreshOnFocus(refresh);

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
          {muscleGroup ? muscleGroup.toUpperCase() : "MUSCLE"}
        </Text>
      </View>

      <ScrollView
        style={globalStyles.progressMuscleScroll}
        contentContainerStyle={globalStyles.progressMuscleScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.progressMuscleExerciseList}>
          {isLoading ? (
            <Text style={globalStyles.workoutMyPrograms}>Loading exercises…</Text>
          ) : null}
          {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
          {!isLoading && !error && exercises.length === 0 ? (
            <Text style={globalStyles.workoutMyPrograms}>No exercises yet</Text>
          ) : null}
          {exercises.map((exercise) => (
            <View key={exercise.exerciseId} style={globalStyles.doExerciseItem}>
              <Pressable
                style={globalStyles.doExerciseSelectTarget}
                onPress={() => {
                  router.push({
                    pathname: PROGRESS_METRIC_DETAIL_HREF,
                    params: {
                      exerciseId: exercise.exerciseId,
                      exerciseName: exercise.name,
                    },
                  } as Href);
                }}
                accessibilityRole="button"
                accessibilityLabel={exercise.name}
              >
                <View style={globalStyles.doExerciseCircle} />
                <Text style={globalStyles.doExerciseName} numberOfLines={1}>
                  {exercise.name.toUpperCase()}
                </Text>
              </Pressable>
              <WorkoutExternalLinkIcon color={colors.backArrow} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
