import { useState } from "react";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { ChevronDownIcon } from "@/components/app/chevron-down-icon";
import { ClockIcon } from "@/components/app/clock-icon";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { SaveExerciseOverlay } from "@/components/app/save-exercise-overlay";
import { SetFeelingBar, type SetFeeling } from "@/components/app/set-feeling-bar";
import { SetNumericInput } from "@/components/app/set-numeric-input";
import { StopwatchIcon } from "@/components/app/stopwatch-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { addRecordedWorkingSet } from "@/features/workout/recorded-working-sets";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function SetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [weight, setWeight] = useState("00.0");
  const [reps, setReps] = useState("0");
  const [setFeeling, setSetFeeling] = useState<SetFeeling>("W");
  const [saveExerciseVisible, setSaveExerciseVisible] = useState(false);
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

  function finishExercise() {
    addRecordedWorkingSet({ weight, reps });
    setSaveExerciseVisible(false);
    const query = new URLSearchParams({
      ...(programName ? { programName } : {}),
      ...(dayName ? { dayName } : {}),
      ...(exerciseName ? { exerciseName } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
    }).toString();
    router.replace(
      (query ? `/workout/workout-screen?${query}` : "/workout/workout-screen") as Href,
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
        <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
          SET
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
      <View style={globalStyles.setScreenWeightLabelRow}>
        <Text style={globalStyles.setScreenWeightLabel}>WEIGHT | KG</Text>
        <Pressable
          onPress={() => {}}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Weight unit"
        >
          <ChevronDownIcon />
        </Pressable>
      </View>
      <SetNumericInput
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        accessibilityLabel="Weight"
      />
      <View style={globalStyles.setScreenWeightLine} />
      <Text style={[globalStyles.setScreenWeightLabel, globalStyles.setScreenRepsLabel]}>
        REPS
      </Text>
      <SetNumericInput
        value={reps}
        onChangeText={setReps}
        keyboardType="number-pad"
        accessibilityLabel="Reps"
      />
      <View style={globalStyles.setScreenWeightLine} />
      <Text style={globalStyles.setScreenFeelingLabel}>SET FEELING</Text>
      <SetFeelingBar value={setFeeling} onChange={setSetFeeling} />
      <View style={globalStyles.setScreenFooter}>
        <View style={globalStyles.setScreenRecordWrap}>
          <AppButton
            title="RECORD"
            onPress={() => {
              setSaveExerciseVisible(true);
            }}
            borderColor={colors.backArrow}
            textColor={colors.inputFill}
            pressAccentColor={colors.backArrow}
          />
        </View>
        <Pressable
          style={globalStyles.setScreenDropSetLink}
          onPress={() => {
            const query = new URLSearchParams({
              ...(programName ? { programName } : {}),
              ...(dayName ? { dayName } : {}),
              ...(exerciseName ? { exerciseName } : {}),
              ...(showEdit ? { showEdit: "1" } : {}),
            }).toString();
            router.push(
              (query ? `/workout/drop-set-entry?${query}` : "/workout/drop-set-entry") as Href,
            );
          }}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Record as Drop Set"
        >
          <Text style={globalStyles.setScreenDropSetLabel}>Record as Drop Set</Text>
        </Pressable>
      </View>
      <View
        style={[
          globalStyles.setScreenTimers,
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
          <Text style={globalStyles.programDayExerciseTimerText}>00:00</Text>
        </View>
      </View>
    </View>
      <SaveExerciseOverlay
        visible={saveExerciseVisible}
        finishTitle="FINISH EXERCISE"
        onFinish={finishExercise}
        onCancel={() => {
          setSaveExerciseVisible(false);
        }}
      />
    </View>
  );
}
