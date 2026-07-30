import { BlurView } from "expo-blur";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { type ReactNode } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { globalStyles, sizes } from "@/styles/global";

type WorkoutGlassCardProps = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

function canUseLiquidGlass() {
  return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
}

export function WorkoutGlassCard({ style, children }: WorkoutGlassCardProps) {
  if (canUseLiquidGlass()) {
    return (
      <GlassView style={style} colorScheme="dark" glassEffectStyle="regular">
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView
      intensity={sizes.workoutGlassBlurIntensity}
      tint="systemChromeMaterialDark"
      style={[style, globalStyles.workoutGlassCardBlurClip]}
    >
      {children}
    </BlurView>
  );
}
