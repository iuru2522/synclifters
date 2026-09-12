import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { ClockIcon } from "@/components/app/clock-icon";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { SaveIcon } from "@/components/app/save-icon";
import { StopwatchIcon } from "@/components/app/stopwatch-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import {
  useProgramDayExercises,
  type DayExerciseListItem,
} from "@/features/workout/user-program-day-exercises";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function ProgramDayExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    dayName?: string | string[];
    programId?: string | string[];
    programName?: string | string[];
    sessionId?: string | string[];
    showEdit?: string | string[];
    fromHistory?: string | string[];
  }>();
  const dayName = readSearchParam(params.dayName);
  const programId = readSearchParam(params.programId);
  const programName = readSearchParam(params.programName);
  const sessionId = readSearchParam(params.sessionId);
  const showEdit = readSearchParam(params.showEdit) === "1";
  const fromHistory = readSearchParam(params.fromHistory) === "1";
  const { exercises, isLoading, error, refresh } = useProgramDayExercises({
    programId,
    dayName,
    sessionId,
    fromHistory,
  });

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  function openWorkout(exercise?: DayExerciseListItem) {
    const nextParams = new URLSearchParams({
      ...(programId ? { programId } : {}),
      ...(programName ? { programName } : {}),
      ...(dayName ? { dayName } : {}),
      ...(sessionId ? { sessionId } : {}),
      ...(exercise?.name ? { exerciseName: exercise.name } : {}),
      ...(exercise?.exerciseId ? { exerciseId: exercise.exerciseId } : {}),
      ...(exercise?.muscleGroup ? { muscleGroup: exercise.muscleGroup } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
      ...(fromHistory ? { fromHistory: "1" } : {}),
    });
    const query = nextParams.toString();
    router.push(
      (query ? `/workout/workout-screen?${query}` : "/workout/workout-screen") as Href,
    );
  }

  function openExerciseHistory(exercise: DayExerciseListItem) {
    const query = new URLSearchParams({
      exerciseName: exercise.name,
      exerciseId: exercise.exerciseId,
    }).toString();
    router.push(`/workout/exercise-history?${query}` as Href);
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
              onPress={() => {}}
              hitSlop={sizes.backArrowHitSlop}
              accessibilityRole="button"
              accessibilityLabel="Save"
            >
              <SaveIcon />
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
