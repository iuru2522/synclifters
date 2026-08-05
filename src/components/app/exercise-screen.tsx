import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import {
  readSearchParam,
  serializeDayNames,
  parseDayNames,
} from "@/components/app/program-day-params";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { globalStyles, sizes, spacing } from "@/styles/global";

const EXERCISE_NAMES = [
  "Triceps",
  "Biceps",
  "Chest",
  "Back",
] as const;

export function ExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    programName?: string | string[];
    dayName?: string | string[];
    dayNames?: string | string[];
  }>();
  const programName = readSearchParam(params.programName);
  const dayName = readSearchParam(params.dayName);
  const dayNames = parseDayNames(params.dayNames);

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
            EXERCISE
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
          {EXERCISE_NAMES.map((label) => (
            <Pressable
              key={label}
              style={globalStyles.exerciseMuscleGroupButton}
              onPress={() => {
                router.push({
                  pathname: "/workout/do-exercise",
                  params: {
                    muscleGroup: label,
                    ...(programName ? { programName } : {}),
                    ...(dayName ? { dayName } : {}),
                    dayNames: serializeDayNames(dayNames),
                  },
                } as Href);
              }}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Text style={globalStyles.profileActionButtonText} numberOfLines={1}>
                {label}
              </Text>
              <ProfileActionArrow />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
