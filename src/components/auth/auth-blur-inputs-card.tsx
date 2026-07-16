import { BlurView } from "expo-blur";
import { type ReactNode } from "react";
import { Platform, View } from "react-native";
import { globalStyles, sizes } from "@/styles/global";
import { useAuthBlurTarget } from "./auth-blur-target-context";

type AuthBlurInputsCardProps = {
  children: ReactNode;
};

export function AuthBlurInputsCard({ children }: AuthBlurInputsCardProps) {
  const blurTarget = useAuthBlurTarget();

  return (
    <BlurView
      intensity={sizes.signInCardBlurIntensity}
      tint="systemThinMaterialDark"
      style={globalStyles.signInInputsCard}
      blurTarget={blurTarget ?? undefined}
      blurMethod={
        Platform.OS === "android" && blurTarget ? "dimezisBlurView" : undefined
      }
    >
      <View style={globalStyles.signInInputsCardTint} pointerEvents="none" />
      <View style={globalStyles.signInInputsCardContent}>{children}</View>
    </BlurView>
  );
}
