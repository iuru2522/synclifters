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

export function WorkoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    exerciseName?: string | string[];
  }>();
  const exerciseName = readSearchParam(params.exerciseName);

  return (
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
      <View style={globalStyles.workoutAccentBar}>
        {exerciseName ? (
          <Text style={globalStyles.workoutAccentBarLabel} numberOfLines={1}>
            {exerciseName}
          </Text>
        ) : null}
      </View>
      <View style={globalStyles.workoutSetHeaders}>
        <View style={globalStyles.workoutSetColSet}>
          <Text style={globalStyles.workoutSetHeaderLabel}>SET</Text>
        </View>
        <View style={globalStyles.workoutSetColWeight}>
          <Text style={globalStyles.workoutSetHeaderLabel}>WEIGHT | KG</Text>
        </View>
        <View style={globalStyles.workoutSetColReps}>
          <Text style={globalStyles.workoutSetHeaderLabel}>REPS</Text>
        </View>
      </View>
      <View style={globalStyles.workoutSetHeadersLine} />
      <View style={globalStyles.workoutSetValues}>
        <View style={globalStyles.workoutSetColSet}>
          <Text style={globalStyles.workoutSetWLabel}>W</Text>
        </View>
        <View style={globalStyles.workoutSetColWeight}>
          <View style={globalStyles.workoutSetValueWithExponent}>
            <Text style={globalStyles.workoutSetWeightLabel}>20</Text>
            <Text style={globalStyles.workoutSetValueExponent}>+2</Text>
          </View>
        </View>
        <View style={globalStyles.workoutSetColReps}>
          <View style={globalStyles.workoutSetValueWithExponent}>
            <Text style={globalStyles.workoutSetWeightLabel}>8</Text>
            <Text style={globalStyles.workoutSetValueExponentNegative}>-2</Text>
          </View>
        </View>
      </View>
      <View style={globalStyles.workoutSetValuesLine} />
      <View style={globalStyles.workoutSetValues}>
        <View style={globalStyles.workoutSetColSet}>
          <Text style={globalStyles.workoutSetIndexLabel}>1</Text>
        </View>
        <View style={globalStyles.workoutSetColWeight}>
          <View style={globalStyles.workoutSetValueWithExponent}>
            <Text style={globalStyles.workoutSetIndexLabel}>20</Text>
            <Text style={globalStyles.workoutSetValueExponent}>+2</Text>
          </View>
        </View>
        <View style={globalStyles.workoutSetColReps}>
          <View style={globalStyles.workoutSetValueWithExponent}>
            <Text style={globalStyles.workoutSetIndexLabel}>8</Text>
            <Text style={globalStyles.workoutSetValueExponentNegative}>-2</Text>
          </View>
        </View>
      </View>
      <View style={globalStyles.workoutSetValuesLine} />
      <View style={globalStyles.workoutSetValues}>
        <View style={globalStyles.workoutSetColSet}>
          <Text style={globalStyles.workoutSetIndexLabel}>2</Text>
        </View>
        <View style={globalStyles.workoutSetColWeight}>
          <View style={globalStyles.workoutSetValueWithExponent}>
            <Text style={globalStyles.workoutSetIndexLabel}>20</Text>
            <Text style={globalStyles.workoutSetValueExponent}>+2</Text>
          </View>
        </View>
        <View style={globalStyles.workoutSetColReps}>
          <View style={globalStyles.workoutSetValueWithExponent}>
            <Text style={globalStyles.workoutSetIndexLabel}>8</Text>
            <Text style={globalStyles.workoutSetValueExponentNegative}>-2</Text>
          </View>
        </View>
      </View>
      <View style={globalStyles.workoutSetValuesLine} />
      <View style={globalStyles.workoutSetValues}>
        <View style={globalStyles.workoutSetColSet}>
          <Text style={globalStyles.workoutSetMutedLabel}>3</Text>
        </View>
        <View style={globalStyles.workoutSetColWeight}>
          <View style={globalStyles.workoutSetValueWithExponent}>
            <Text style={globalStyles.workoutSetMutedLabel}>18</Text>
            <Text
              style={globalStyles.workoutSetValueExponentHidden}
              accessibilityElementsHidden
            >
              +2
            </Text>
          </View>
        </View>
        <View style={globalStyles.workoutSetColReps}>
          <Text style={globalStyles.workoutSetMutedLabel}>10</Text>
        </View>
      </View>
      <View style={globalStyles.workoutSetValuesLine} />
      <Text style={globalStyles.workoutLastWorkout}>Last Workout Was 06/11/25</Text>
      <View style={globalStyles.programDayExerciseSelectDayWrap}>
        <AppButton
          title="ADD SET"
          onPress={() => {
            router.push("/workout/set-screen" as Href);
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
