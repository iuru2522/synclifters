import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import {
  parseDayNames,
  readSearchParam,
  serializeDayNames,
} from "@/components/app/program-day-params";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileMetrics } from "@/features/users/profile-display";
import {
  formatRepTypeLabel,
  useSelectedRepType,
} from "@/features/workout/rep-type-selection";
import { globalStyles, sizes, spacing } from "@/styles/global";

const METRICS_SHEET_HREF = "/workout/metrics-sheet" as Href;
const REP_TYPE_SHEET_HREF = "/workout/rep-type-sheet" as Href;

export function AddExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const params = useLocalSearchParams<{
    programName?: string | string[];
    dayName?: string | string[];
    dayNames?: string | string[];
  }>();
  const programName = readSearchParam(params.programName);
  const dayName = readSearchParam(params.dayName);
  const dayNames = parseDayNames(params.dayNames);
  const metricsLabel = formatProfileMetrics(profile);
  const selectedRepType = useSelectedRepType();
  const buttons = [
    { id: "exercise", label: "Exercise" },
    { id: "metrics", label: metricsLabel === "Not set" ? "Metrics" : metricsLabel },
    { id: "rep-type", label: formatRepTypeLabel(selectedRepType) },
  ] as const;

  return (
    <View style={globalStyles.createProgramScreen}>
      <View
        style={{
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
        }}
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
            ADD EXERCISE
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

        <View style={globalStyles.addExerciseActionButtons}>
          {buttons.map((button) => (
            <Pressable
              key={button.id}
              style={globalStyles.addExerciseActionButton}
              onPress={() => {
                if (button.id === "exercise") {
                  router.push({
                    pathname: "/workout/exercise",
                    params: {
                      ...(programName ? { programName } : {}),
                      ...(dayName ? { dayName } : {}),
                      dayNames: serializeDayNames(dayNames),
                    },
                  } as Href);
                } else if (button.id === "metrics") {
                  router.push(METRICS_SHEET_HREF);
                } else if (button.id === "rep-type") {
                  router.push(REP_TYPE_SHEET_HREF);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={button.label}
            >
              <Text style={globalStyles.profileActionButtonText} numberOfLines={1}>
                {button.label}
              </Text>
              <ProfileActionArrow />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
