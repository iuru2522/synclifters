import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { ClockIcon } from "@/components/app/clock-icon";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { SaveExerciseOverlay } from "@/components/app/save-exercise-overlay";
import { SaveIcon } from "@/components/app/save-icon";
import { StopwatchIcon } from "@/components/app/stopwatch-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import {
  clearFinishedWorkoutExercises,
  useHasFinishedAnyWorkoutExercise,
} from "@/features/workout/finished-workout-exercises";
import {
  addExerciseHref,
  exerciseHistoryHref,
  readSearchParam,
  serializeDayNames,
  WORKOUT_HOME_HREF,
  workoutHomeHref,
  workoutScreenHref,
} from "@/features/workout/nav-params";
import { formatLastWorkoutDate } from "@/features/workout/session-display";
import {
  useProgramDayExercises,
  type DayExerciseListItem,
} from "@/features/workout/user-program-day-exercises";
import {
  clearWorkoutDuration,
  formatDurationClock,
  useWorkoutElapsedLabel,
} from "@/features/workout/workout-duration";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function ProgramDayExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [saveWorkoutVisible, setSaveWorkoutVisible] = useState(false);
  const hasFinishedAnyExercise = useHasFinishedAnyWorkoutExercise();
  const saveDisabled = !hasFinishedAnyExercise;
  const params = useLocalSearchParams<{
    dayName?: string | string[];
    programId?: string | string[];
    programName?: string | string[];
    sessionId?: string | string[];
    showEdit?: string | string[];
    fromHistory?: string | string[];
    selectDay?: string | string[];
    performedAt?: string | string[];
    durationMs?: string | string[];
  }>();
  const dayName = readSearchParam(params.dayName);
  const programId = readSearchParam(params.programId);
  const programName = readSearchParam(params.programName);
  const sessionId = readSearchParam(params.sessionId);
  const showEdit = readSearchParam(params.showEdit) === "1";
  const fromHistory = readSearchParam(params.fromHistory) === "1";
  const selectDay = readSearchParam(params.selectDay) === "1";
  const performedAtRaw = readSearchParam(params.performedAt);
  const performedAtMs = performedAtRaw ? Number(performedAtRaw) : NaN;
  const durationMsRaw = readSearchParam(params.durationMs);
  const historyDurationMs = durationMsRaw ? Number(durationMsRaw) : NaN;
  const liveElapsedLabel = useWorkoutElapsedLabel();
  const durationLabel =
    fromHistory && Number.isFinite(historyDurationMs)
      ? formatDurationClock(historyDurationMs)
      : fromHistory
        ? formatDurationClock(0)
        : liveElapsedLabel;
  const lastWorkoutLabel =
    fromHistory && Number.isFinite(performedAtMs)
      ? `Last Workout Was ${formatLastWorkoutDate(performedAtMs)}`
      : null;
  const { exercises, isLoading, error, refresh } = useProgramDayExercises({
    programId,
    dayName,
    sessionId,
    fromHistory,
  });

  useRefreshOnFocus(refresh);

  function openWorkout(exercise?: DayExerciseListItem) {
    router.push(
      workoutScreenHref({
        programId,
        programName,
        dayName,
        sessionId,
        exerciseName: exercise?.name,
        exerciseId: exercise?.exerciseId,
        muscleGroup: exercise?.muscleGroup,
        showEdit,
        fromHistory,
        performedAt: performedAtRaw,
        durationMs: durationMsRaw,
      }),
    );
  }

  function openExerciseHistory(exercise: DayExerciseListItem) {
    router.push(
      exerciseHistoryHref({
        exerciseName: exercise.name,
        exerciseId: exercise.exerciseId,
      }),
    );
  }

  function openAddExercise() {
    if (!dayName || !programId) {
      return;
    }

    router.push(
      addExerciseHref({
        dayName,
        dayNames: serializeDayNames([dayName]),
        programId,
        programName,
      }),
    );
  }

  function openSelectDay() {
    if (!dayName) {
      return;
    }

    router.dismissTo(
      workoutHomeHref({
        dayName,
        programId,
        programName,
      }),
    );
  }

  function finishWorkout() {
    setSaveWorkoutVisible(false);
    clearFinishedWorkoutExercises();
    clearWorkoutDuration();
    router.dismissTo(WORKOUT_HOME_HREF);
  }

  return (
    <View style={globalStyles.programDayExerciseScreen}>
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
              fromHistory ? null : globalStyles.createDayHeaderTitleWithSave,
            ]}
            numberOfLines={1}
          >
            {dayName}
          </Text>
        ) : null}
        <View style={[globalStyles.createDayHeaderMenu, globalStyles.createDayHeaderMenuRow]}>
          {fromHistory ? null : (
            <Pressable
              onPress={() => {
                setSaveWorkoutVisible(true);
              }}
              disabled={saveDisabled}
              hitSlop={sizes.backArrowHitSlop}
              accessibilityRole="button"
              accessibilityState={{ disabled: saveDisabled }}
              accessibilityLabel="Save"
            >
              <SaveIcon
                color={
                  saveDisabled
                    ? colors.workoutStartTrainingBar
                    : colors.backArrow
                }
              />
            </Pressable>
          )}
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
        {isLoading ? (
          <Text style={globalStyles.workoutMyPrograms}>Loading exercises…</Text>
        ) : null}
        {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
        {!isLoading && !error && exercises.length === 0 ? (
          <Text style={globalStyles.workoutMyPrograms}>No exercises yet</Text>
        ) : null}
        {exercises.map((exercise) => (
          <View key={exercise.id} style={globalStyles.doExerciseItem}>
            <View style={globalStyles.doExerciseSelectTarget}>
              <Pressable
                onPress={() => {
                  openExerciseHistory(exercise);
                }}
                hitSlop={sizes.backArrowHitSlop}
                accessibilityRole="button"
                accessibilityLabel={`${exercise.name} history`}
              >
                <View style={globalStyles.doExerciseCircle} />
              </Pressable>
              <Pressable
                style={globalStyles.programDayExerciseNamePressable}
                onPress={() => {
                  openWorkout(exercise);
                }}
                hitSlop={sizes.backArrowHitSlop}
                accessibilityRole="button"
                accessibilityLabel={exercise.name}
              >
                <Text style={globalStyles.programDayExerciseName} numberOfLines={1}>
                  {exercise.name}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
        {lastWorkoutLabel ? (
          <Text style={globalStyles.programDayLastWorkout}>{lastWorkoutLabel}</Text>
        ) : null}
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
      {fromHistory ? null : (
        <Pressable
          style={globalStyles.addExerciseDayRecordLink}
          onPress={openAddExercise}
          disabled={!dayName || !programId}
          accessibilityRole="button"
          accessibilityLabel="Add exercise"
        >
          <Text style={globalStyles.addExerciseDayRecordLabel}>ADD EXERCISE</Text>
        </Pressable>
      )}
      {selectDay && !fromHistory ? (
        <View style={globalStyles.programDayExerciseSelectDayButtonWrap}>
          <AppButton
            title="SELECT DAY"
            onPress={openSelectDay}
            borderColor={colors.backArrow}
            textColor={colors.inputFill}
            pressAccentColor={colors.backArrow}
            accessibilityLabel="Select day"
          />
        </View>
      ) : null}
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
          <Text style={globalStyles.programDayExerciseTimerText}>{durationLabel}</Text>
        </View>
        {fromHistory ? null : (
          <View
            style={[
              globalStyles.programDayExerciseTimer,
              globalStyles.programDayExerciseStopwatchTimer,
            ]}
          >
            <StopwatchIcon />
            <Text style={globalStyles.programDayExerciseStopwatchTimerText}>
              00:00
            </Text>
          </View>
        )}
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
