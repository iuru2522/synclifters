import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { globalStyles, sizes } from "@/styles/global";

type SaveExerciseOverlayProps = {
  visible: boolean;
  finishTitle?: string;
  onFinish: () => void;
  onCancel: () => void;
};

export function SaveExerciseOverlay({
  visible,
  finishTitle = "FINISH WORKOUT",
  onFinish,
  onCancel,
}: SaveExerciseOverlayProps) {
  const holdProgress = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      cancelAnimation(holdProgress);
      holdProgress.value = 0;
    }
  }, [holdProgress, visible]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${holdProgress.value * 100}%`,
  }));

  function startHold() {
    holdProgress.value = withTiming(
      1,
      {
        duration: sizes.saveExerciseHoldDurationMs,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      },
    );
  }

  function cancelHold() {
    cancelAnimation(holdProgress);
    holdProgress.value = withTiming(0, {
      duration: sizes.saveExerciseHoldResetDurationMs,
      easing: Easing.out(Easing.cubic),
    });
  }

  if (!visible) {
    return null;
  }

  return (
    <View style={globalStyles.saveExerciseOverlay} pointerEvents="auto">
      <BlurView
        intensity={sizes.saveExerciseBlurIntensity}
        tint="dark"
        style={globalStyles.saveExerciseOverlayBlur}
        blurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
      >
        <View style={globalStyles.saveExerciseOverlayTint} pointerEvents="none" />
        <View style={globalStyles.saveExerciseOverlayContent}>
          <View style={globalStyles.saveExerciseFinishWrap}>
            <Pressable
              style={globalStyles.saveExerciseHoldButton}
              onPressIn={startHold}
              onPressOut={cancelHold}
              accessibilityRole="button"
              accessibilityLabel={finishTitle}
            >
              <Animated.View
                style={[globalStyles.saveExerciseHoldProgress, progressStyle]}
              />
              <Text style={globalStyles.saveExerciseHoldLabel}>{finishTitle}</Text>
            </Pressable>
          </View>
          <Pressable
            style={globalStyles.saveExerciseCancel}
            onPress={onCancel}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={globalStyles.saveExerciseCancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}
