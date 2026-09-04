import { useState } from "react";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { ChevronDownIcon } from "@/components/app/chevron-down-icon";
import { ClockIcon } from "@/components/app/clock-icon";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { PlusCircleIcon } from "@/components/app/plus-circle-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { SaveExerciseOverlay } from "@/components/app/save-exercise-overlay";
import { SaveIcon } from "@/components/app/save-icon";
import { StopwatchIcon } from "@/components/app/stopwatch-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useRecordedDropSets } from "@/features/workout/recorded-drop-sets";
import { useRecordedWorkingSets } from "@/features/workout/recorded-working-sets";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function WorkoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [saveWorkoutVisible, setSaveWorkoutVisible] = useState(false);
  const params = useLocalSearchParams<{
    exerciseName?: string | string[];
    dayName?: string | string[];
    programName?: string | string[];
    showEdit?: string | string[];
  }>();
  const exerciseName = readSearchParam(params.exerciseName);
  const dayName = readSearchParam(params.dayName);
  const programName = readSearchParam(params.programName);
  const showEdit = readSearchParam(params.showEdit) === "1";
  const dropSets = useRecordedDropSets();
  const workingSets = useRecordedWorkingSets();
  const hasSetRows = workingSets.length > 0 || dropSets.length > 0;

  function finishWorkout() {
    setSaveWorkoutVisible(false);
    const query = new URLSearchParams({
      ...(programName ? { programName } : {}),
      ...(dayName ? { dayName } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
    }).toString();
    router.replace(
      (query
        ? `/workout/program-day-exercise?${query}`
        : "/workout/program-day-exercise") as Href,
    );
  }

  return (
    <View style={globalStyles.workoutScreen}>
    <View
      style={[
        globalStyles.workoutScreen,
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
        <Text
          style={[
            globalStyles.createDayHeaderTitle,
            globalStyles.createDayHeaderTitleWithSave,
          ]}
          numberOfLines={1}
        >
          WORKOUT
        </Text>
        <View style={[globalStyles.createDayHeaderMenu, globalStyles.createDayHeaderMenuRow]}>
          <Pressable
            onPress={() => {
              setSaveWorkoutVisible(true);
            }}
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
      <View style={globalStyles.workoutAccentBar}>
        <View style={globalStyles.workoutAccentBarTitle}>
          {exerciseName ? (
            <Text style={globalStyles.workoutAccentBarLabel} numberOfLines={1}>
              {exerciseName}
            </Text>
          ) : null}
        </View>
        <Pressable
          style={globalStyles.workoutAccentBarPlus}
          onPress={() => {}}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Add"
        >
          <PlusCircleIcon color={colors.background} />
        </Pressable>
      </View>
      <View style={globalStyles.workoutSetHeaders}>
        <View style={globalStyles.workoutSetColSet}>
          <Text style={globalStyles.workoutSetHeaderLabel}>SET</Text>
        </View>
        <View style={globalStyles.workoutSetColWeight}>
          <View style={globalStyles.workoutSetHeaderWeightRow}>
            <Text style={globalStyles.workoutSetHeaderLabel}>WEIGHT | KG</Text>
            <Pressable
              onPress={() => {}}
              hitSlop={sizes.backArrowHitSlop}
              accessibilityRole="button"
              accessibilityLabel="Weight unit"
            >
              <ChevronDownIcon />
            </Pressable>
          </View>
        </View>
        <View style={globalStyles.workoutSetColReps}>
          <Text style={globalStyles.workoutSetHeaderLabel}>REPS</Text>
        </View>
      </View>
      <View style={globalStyles.workoutSetHeadersLine} />
      {workingSets.map((set) => (
        <View key={set.label}>
          <View style={globalStyles.workoutSetValues}>
            <View style={globalStyles.workoutSetColSet}>
              <Text style={globalStyles.workoutSetIndexLabel}>{set.label}</Text>
            </View>
            <View style={globalStyles.workoutSetColWeight}>
              <Text style={globalStyles.workoutSetIndexLabel}>{set.weight}</Text>
            </View>
            <View style={globalStyles.workoutSetColReps}>
              <Text style={globalStyles.workoutSetIndexLabel}>{set.reps}</Text>
            </View>
          </View>
          <View style={globalStyles.workoutSetValuesLine} />
        </View>
      ))}
      {dropSets.length > 0 ? (
        <>
          <View style={globalStyles.workoutDropSetGroup}>
            <View
              style={[globalStyles.workoutSetStatusBar, globalStyles.workoutSetStatusBarDrop]}
            />
            {dropSets.map((drop, index) => (
              <View key={`drop-${index}`} style={globalStyles.workoutDropSetRow}>
                <View style={globalStyles.workoutSetColSet}>
                  <Text style={globalStyles.workoutSetIndexLabel}>{`D${index + 1}`}</Text>
                </View>
                <View style={globalStyles.workoutSetColWeight}>
                  <Text style={globalStyles.workoutSetIndexLabel}>{drop.weight}</Text>
                </View>
                <View style={globalStyles.workoutSetColReps}>
                  <Text style={globalStyles.workoutSetIndexLabel}>{drop.reps}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={globalStyles.workoutSetRowLine} />
        </>
      ) : null}
      {hasSetRows ? (
        <Text style={globalStyles.workoutLastWorkout}>Last Workout Was 06/11/25</Text>
      ) : null}
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
      <View style={globalStyles.programDayExerciseSelectDayWrap}>
        <AppButton
          title="ADD SET"
          onPress={() => {
            const query = new URLSearchParams({
              ...(programName ? { programName } : {}),
              ...(dayName ? { dayName } : {}),
              ...(exerciseName ? { exerciseName } : {}),
              ...(showEdit ? { showEdit: "1" } : {}),
            }).toString();
            router.push(
              (query ? `/workout/set-screen?${query}` : "/workout/set-screen") as Href,
            );
          }}
          borderColor={colors.backArrow}
          textColor={colors.inputFill}
          pressAccentColor={colors.backArrow}
        />
      </View>
      <View
        style={[
          globalStyles.workoutTimers,
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
          <Text style={globalStyles.programDayExerciseTimerText}>00:22</Text>
        </View>
        <View
          style={[
            globalStyles.programDayExerciseTimer,
            globalStyles.programDayExerciseStopwatchTimer,
          ]}
        >
          <StopwatchIcon />
          <Text style={globalStyles.programDayExerciseStopwatchTimerText}>00:00</Text>
        </View>
      </View>
    </View>
      <SaveExerciseOverlay
        visible={saveWorkoutVisible}
        finishTitle="FINISH WORKOUT"
        onFinish={finishWorkout}
        onCancel={() => {
          setSaveWorkoutVisible(false);
        }}
      />
    </View>
  );
}
