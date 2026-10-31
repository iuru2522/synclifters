import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
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
import { useAuth } from "@/features/auth/auth-context";
import { markWorkoutExerciseFinished } from "@/features/workout/finished-workout-exercises";
import {
  clearRecordedDropSets,
  useRecordedDropSets,
} from "@/features/workout/recorded-drop-sets";
import {
  clearRecordedWorkingSets,
  useRecordedWorkingSets,
} from "@/features/workout/recorded-working-sets";
import { createCompletedSession } from "@/features/workout/session-repository";
import {
  ensureWorkoutDurationStarted,
  formatDurationClock,
  getWorkoutElapsedMs,
  useWorkoutElapsedLabel,
} from "@/features/workout/workout-duration";
import { workoutExerciseKey } from "@/features/workout/workout-exercise-key";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function WorkoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const [saveWorkoutVisible, setSaveWorkoutVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const params = useLocalSearchParams<{
    exerciseName?: string | string[];
    exerciseId?: string | string[];
    muscleGroup?: string | string[];
    dayName?: string | string[];
    programId?: string | string[];
    programName?: string | string[];
    sessionId?: string | string[];
    showEdit?: string | string[];
    fromHistory?: string | string[];
    performedAt?: string | string[];
    durationMs?: string | string[];
  }>();
  const exerciseName = readSearchParam(params.exerciseName);
  const exerciseId = readSearchParam(params.exerciseId);
  const muscleGroup = readSearchParam(params.muscleGroup);
  const dayName = readSearchParam(params.dayName);
  const programId = readSearchParam(params.programId);
  const programName = readSearchParam(params.programName);
  const sessionId = readSearchParam(params.sessionId);
  const showEdit = readSearchParam(params.showEdit) === "1";
  const fromHistory = readSearchParam(params.fromHistory) === "1";
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
      ? `Last Workout Was ${new Date(performedAtMs).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit",
        })}`
      : null;
  const exerciseKey = workoutExerciseKey(exerciseId, exerciseName);

  useEffect(() => {
    if (!fromHistory) {
      ensureWorkoutDurationStarted();
    }
  }, [fromHistory]);
  const dropSets = useRecordedDropSets(exerciseKey);
  const workingSets = useRecordedWorkingSets(exerciseKey);
  const recordedSetCount = workingSets.length + dropSets.length;
  const hasSetRows = recordedSetCount > 0;
  const saveDisabled = !hasSetRows;
  const listScrollEnabled = recordedSetCount >= sizes.workoutScrollableSetCount;

  function openAddSet() {
    const query = new URLSearchParams({
      ...(programId ? { programId } : {}),
      ...(programName ? { programName } : {}),
      ...(dayName ? { dayName } : {}),
      ...(exerciseName ? { exerciseName } : {}),
      ...(exerciseId ? { exerciseId } : {}),
      ...(muscleGroup ? { muscleGroup } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
      ...(fromHistory ? { fromHistory: "1" } : {}),
    }).toString();
    router.push(
      (query ? `/workout/set-screen?${query}` : "/workout/set-screen") as Href,
    );
  }

  function navigateAfterFinish() {
    const query = new URLSearchParams({
      ...(programId ? { programId } : {}),
      ...(programName ? { programName } : {}),
      ...(dayName ? { dayName } : {}),
      ...(sessionId ? { sessionId } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
      ...(fromHistory ? { fromHistory: "1" } : {}),
      ...(performedAtRaw ? { performedAt: performedAtRaw } : {}),
      ...(durationMsRaw ? { durationMs: durationMsRaw } : {}),
    }).toString();
    router.replace(
      (query
        ? `/workout/program-day-exercise?${query}`
        : "/workout/program-day-exercise") as Href,
    );
  }

  async function finishWorkout() {
    if (isSaving) {
      return;
    }

    setSaveWorkoutVisible(false);

    if (fromHistory || !hasSetRows) {
      clearRecordedWorkingSets(exerciseKey);
      clearRecordedDropSets(exerciseKey);
      navigateAfterFinish();
      return;
    }

    if (!user) {
      Alert.alert("Sign in required", "Sign in to save your workout.");
      return;
    }

    if (!programName || !dayName || !exerciseName) {
      Alert.alert(
        "Missing workout details",
        "Program, day, and exercise are required to save.",
      );
      return;
    }

    setIsSaving(true);

    try {
      await createCompletedSession(user.uid, {
        programId,
        programName,
        dayName,
        exerciseId,
        exerciseName,
        muscleGroup,
        workingSets,
        dropSets,
        durationMs: getWorkoutElapsedMs(),
      });
      markWorkoutExerciseFinished(exerciseKey);
      clearRecordedWorkingSets(exerciseKey);
      clearRecordedDropSets(exerciseKey);
      await refreshProfile({ silent: true });
      navigateAfterFinish();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save workout.";
      Alert.alert("Save failed", message);
    } finally {
      setIsSaving(false);
    }
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
        {fromHistory ? null : (
          <Pressable
            style={globalStyles.workoutAccentBarPlus}
            onPress={openAddSet}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Add set"
          >
            <PlusCircleIcon color={colors.background} />
          </Pressable>
        )}
      </View>
      <ScrollView
        style={globalStyles.workoutScreenScroll}
        contentContainerStyle={[
          globalStyles.workoutScreenScrollContent,
          globalStyles.workoutScreenScrollContentFlushBottom,
        ]}
        scrollEnabled={listScrollEnabled}
        showsVerticalScrollIndicator={false}
      >
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
        {lastWorkoutLabel ? (
          <Text style={globalStyles.workoutLastWorkout}>{lastWorkoutLabel}</Text>
        ) : null}
        <View style={globalStyles.programDayExerciseSelectDayWrap}>
          <AppButton
            title="ADD SET"
            onPress={openAddSet}
            borderColor={colors.backArrow}
            textColor={colors.inputFill}
            pressAccentColor={colors.backArrow}
          />
        </View>
      </ScrollView>
      <View style={globalStyles.workoutTimers}>
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
            <Text style={globalStyles.programDayExerciseStopwatchTimerText}>00:00</Text>
          </View>
        )}
      </View>
    </View>
      <SaveExerciseOverlay
        visible={saveWorkoutVisible}
        finishTitle="FINISH EXERCISE"
        onFinish={finishWorkout}
        onCancel={() => {
          setSaveWorkoutVisible(false);
        }}
      />
    </View>
  );
}
