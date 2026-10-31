import { useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useUserProgressExercises } from "@/features/workout/user-progress-exercises";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { globalStyles, spacing } from "@/styles/global";

const PROGRESS_MUSCLE_HREF = "/progress/progress-muscle" as Href;
const PROGRESS_METRIC_HREF = "/progress/progress-metric" as Href;

const METRIC_ROWS = [
  { id: "weight", label: "Weight", metric: "weight" },
  { id: "height", label: "Height", metric: "height" },
] as const;

function ProgressRow({
  label,
  onPress,
  tone = "default",
}: {
  label: string;
  onPress?: () => void;
  tone?: "default" | "exercise";
}) {
  return (
    <Pressable
      style={[
        globalStyles.progressRowButton,
        tone === "exercise" ? globalStyles.progressExerciseRowButton : null,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={globalStyles.profileActionButtonText} numberOfLines={1}>
        {label}
      </Text>
      <ProfileActionArrow />
    </Pressable>
  );
}

export function ProgressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { muscleGroups, isLoading, error, refresh } = useUserProgressExercises();

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
        <Text style={globalStyles.createDayHeaderTitle}>PROGRESS</Text>
      </View>

      <ScrollView
        style={globalStyles.progressScreenScroll}
        contentContainerStyle={globalStyles.progressScreenScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.progressSection}>
          <Text style={globalStyles.progressSectionLabel}>METRICS</Text>
          <View style={globalStyles.progressRowList}>
            {METRIC_ROWS.map((row) => (
              <ProgressRow
                key={row.id}
                label={row.label}
                onPress={() => {
                  router.push({
                    pathname: PROGRESS_METRIC_HREF,
                    params: { metric: row.metric },
                  } as Href);
                }}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={globalStyles.progressProWaitList}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Pro version wait list"
        >
          <Text style={globalStyles.progressProWaitListText}>PRO VERSION WAIT LIST</Text>
        </Pressable>

        <View style={globalStyles.progressSection}>
          <Text style={globalStyles.progressSectionLabel}>EXERCIES</Text>
          <View style={globalStyles.progressRowList}>
            {isLoading ? (
              <Text style={globalStyles.workoutMyPrograms}>Loading exercises…</Text>
            ) : null}
            {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
            {!isLoading && !error && muscleGroups.length === 0 ? (
              <Text style={globalStyles.workoutMyPrograms}>No exercises yet</Text>
            ) : null}
            {muscleGroups.map((muscleGroup) => (
              <ProgressRow
                key={muscleGroup}
                label={muscleGroup}
                tone="exercise"
                onPress={() => {
                  router.push({
                    pathname: PROGRESS_MUSCLE_HREF,
                    params: { muscleGroup },
                  } as Href);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
