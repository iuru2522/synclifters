import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";
import { useAuthBack, type AuthHref } from "./use-auth-back";

type AuthBackButtonProps = {
  href?: AuthHref;
  fallbackHref?: AuthHref;
  title?: string;
  color?: string;
  /** Exact px space from the arrow's right edge to the title (Figma). */
  gap?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export function AuthBackButton({
  href,
  fallbackHref = "/sign-in",
  title = "Create Account",
  color = colors.backArrow,
  gap = spacing.authBackTitleDefault,
  style,
  onPress,
}: AuthBackButtonProps) {
  const handleBack = useAuthBack({ href, fallbackHref });

  return (
    <View style={[globalStyles.backArrowRow, style]} pointerEvents="box-none">
      <Pressable
        onPress={onPress ?? handleBack}
        hitSlop={sizes.backArrowHitSlop}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <View style={globalStyles.backArrowTriangleSlot}>
          <View style={[globalStyles.backArrowTriangle, { borderRightColor: color }]} />
        </View>
      </Pressable>

      <View style={{ width: gap }} />

      <Text style={[globalStyles.authScreenTitle, { color }]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}
