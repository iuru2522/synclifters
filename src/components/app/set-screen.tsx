import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { ClockIcon } from "@/components/app/clock-icon";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { StopwatchIcon } from "@/components/app/stopwatch-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function SetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      <Text style={globalStyles.setScreenWeightLabel}>WEIGHT | KG</Text>
      <Text style={globalStyles.setScreenWeightValue}>50.0</Text>
      <View style={globalStyles.setScreenWeightLine} />
      <View style={globalStyles.setScreenFooter}>
        <View style={globalStyles.setScreenRecordWrap}>
          <AppButton
            title="RECORD"
            onPress={() => {}}
            borderColor={colors.backArrow}
            textColor={colors.inputFill}
            pressAccentColor={colors.backArrow}
          />
        </View>
        <Pressable
          style={globalStyles.setScreenDropSetLink}
          onPress={() => {}}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Record as Drop Set"
        >
          <Text style={globalStyles.setScreenDropSetLabel}>Record as Drop Set</Text>
        </Pressable>
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
    </View>
  );
}
