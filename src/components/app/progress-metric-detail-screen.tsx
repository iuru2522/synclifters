import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseSessionHistoryList } from "@/components/app/exercise-session-history-list";
import { SlidersHIcon } from "@/components/app/sliders-h-icon";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { catalogExerciseId } from "@/features/workout/day-exercises";
import { readSearchParam } from "@/features/workout/nav-params";
import { useExerciseSessionHistory } from "@/features/workout/user-exercise-history";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { globalStyles, sizes, spacing } from "@/styles/global";

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
          {title}
        </Text>
        <Pressable
          style={globalStyles.createDayHeaderMenu}
          onPress={() => {}}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Filters"
        >
          <SlidersHIcon />
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

        <ExerciseSessionHistoryList
          sessions={sessions}
          exerciseId={exerciseId}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>
    </View>
  );
}
