import { useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { globalStyles, sizes, spacing } from "@/styles/global";

const PROGRESS_MUSCLE_HREF = "/workout/progress-muscle" as Href;
const PROGRESS_METRIC_HREF = "/workout/progress-metric" as Href;

const METRIC_ROWS = [
  { id: "weight", label: "Weight", metric: "weight" },
  { id: "height", label: "Height", metric: "height" },
] as const;

const EXERCISE_ROWS = Array.from({ length: 10 }, (_, index) => ({
  id: `triceps-${index}`,
  label: "Triceps",
  muscleGroup: "Triceps",
}));

function ProgressRow({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={globalStyles.progressRowButton}
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

        <View style={globalStyles.progressSection}>
          <Text style={globalStyles.progressSectionLabel}>EXERCIES</Text>
          <View style={globalStyles.progressRowList}>
            {EXERCISE_ROWS.map((row) => (
              <ProgressRow
                key={row.id}
                label={row.label}
                onPress={() => {
                  router.push({
                    pathname: PROGRESS_MUSCLE_HREF,
                    params: { muscleGroup: row.muscleGroup },
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
