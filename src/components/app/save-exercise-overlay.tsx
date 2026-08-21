import { BlurView } from "expo-blur";
import { Platform, Pressable, Text, View } from "react-native";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles, sizes } from "@/styles/global";

type SaveExerciseOverlayProps = {
  visible: boolean;
  finishTitle?: "FINISH EXERCISE" | "FINISH WORKOUT";
  onFinish: () => void;
  onCancel: () => void;
};

export function SaveExerciseOverlay({
  visible,
  finishTitle = "FINISH WORKOUT",
  onFinish,
  onCancel,
}: SaveExerciseOverlayProps) {
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
            <AppButton
              title={finishTitle}
              onPress={onFinish}
              borderColor={colors.backArrow}
              textColor={colors.inputFill}
              pressAccentColor={colors.backArrow}
              accessibilityLabel={finishTitle}
            />
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
