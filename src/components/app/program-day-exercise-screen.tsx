import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { ClockIcon } from "@/components/app/clock-icon";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { SaveIcon } from "@/components/app/save-icon";
import { StopwatchIcon } from "@/components/app/stopwatch-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const EXERCISES = [
  "Tricep Pushdown",
  "Barbell Bench Press",
  "Lat Pulldown",
  "Romanian Deadlift",
  "Shoulder Press",
  "Cable Fly",
] as const;

export function ProgramDayExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    dayName?: string | string[];
    programName?: string | string[];
    showEdit?: string | string[];
  }>();
  const dayName = readSearchParam(params.dayName);
  const programName = readSearchParam(params.programName);
  const showEdit = readSearchParam(params.showEdit) === "1";

  function openWorkout(exerciseName?: string) {
    const params = new URLSearchParams({
      ...(programName ? { programName } : {}),
      ...(dayName ? { dayName } : {}),
      ...(exerciseName ? { exerciseName } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
    });
    const query = params.toString();
    router.push(
      (query ? `/workout/workout-screen?${query}` : "/workout/workout-screen") as Href,
    );
  }

  function openExerciseHistory(exerciseName: string) {
    router.push(
      `/workout/exercise-history?exerciseName=${encodeURIComponent(exerciseName)}` as Href,
    );
  }

  return (
    <View
      style={[
        globalStyles.programDayExerciseScreen,
        {
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
        },
      ]}
    >
      <View style={globalStyles.createDayHeader}>
        <View style={globalStyles.createDayHeaderBack}>
          <AuthBackButton
            title=""
            style={globalStyles.programDayBackButton}
            onPress={() => {
              router.back();
            }}
          />
        </View>
        {dayName ? (
          <Text
            style={[
              globalStyles.createDayHeaderTitle,
              globalStyles.createDayHeaderTitleWithSave,
            ]}
            numberOfLines={1}
          >
            {dayName}
          </Text>
        ) : null}
        <View style={[globalStyles.createDayHeaderMenu, globalStyles.createDayHeaderMenuRow]}>
          <Pressable
            onPress={() => {}}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Save"
          >
            <SaveIcon />
          </Pressable>
          <Pressable
            onPress={() => {}}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <CreateDayBurgerIcon />
          </Pressable>
        </View>
      </View>
      <View style={globalStyles.programDayExerciseCirclesRow}>
        {EXERCISES.map((name) => (
          <View key={name} style={globalStyles.doExerciseItem}>
            <View style={globalStyles.doExerciseSelectTarget}>
              <Pressable
                onPress={() => {
                  openExerciseHistory(name);
                }}
                hitSlop={sizes.backArrowHitSlop}
                accessibilityRole="button"
                accessibilityLabel={`${name} history`}
              >
                <View style={globalStyles.doExerciseCircle} />
              </Pressable>
              <Pressable
                onPress={() => {
                  openWorkout(name);
                }}
                hitSlop={sizes.backArrowHitSlop}
                accessibilityRole="button"
                accessibilityLabel={name}
              >
                <Text style={globalStyles.programDayExerciseName} numberOfLines={1}>
                  {name}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
      {showEdit ? (
        <View style={globalStyles.programDayEditWrap}>
          <AppButton
            title="EDIT"
            onPress={() => {}}
            borderColor={colors.white}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            pressAccentColor={colors.backArrow}
            accessibilityLabel="Edit"
          />
        </View>
      ) : null}
      <View style={globalStyles.addExerciseDayRecordLink}>
        <Text style={globalStyles.addExerciseDayRecordLabel}>ADD EXERCISE</Text>
      </View>
      <View
        style={[
          globalStyles.programDayExerciseTimers,
          {
            paddingBottom: Math.max(insets.bottom, spacing.safeAreaBottomMin),
          },
        ]}
      >
        <View
          style={[
            globalStyles.programDayExerciseTimer,
            globalStyles.programDayExerciseClockTimer,
          ]}
        >
          <ClockIcon />
          <Text style={globalStyles.programDayExerciseTimerText}>00:00</Text>
        </View>
        <View
          style={[
            globalStyles.programDayExerciseTimer,
            globalStyles.programDayExerciseStopwatchTimer,
          ]}
        >
          <StopwatchIcon />
          <Text style={globalStyles.programDayExerciseTimerText}>00:00</Text>
        </View>
      </View>
    </View>
  );
}
