import { colors, globalStyles, sizes } from "@/styles/global";
import { useCallback } from "react";
import { Pressable, Text, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const pressTiming = {
  duration: sizes.authButtonPressDuration,
  easing: Easing.out(Easing.cubic),
};

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  borderColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pressFillColor?: string;
  pressLabelColor?: string;
  pressAccentColor?: string;
  accessibilityLabel?: string;
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  borderColor = colors.backArrow,
  textColor = colors.inputFill,
  style,
  textStyle,
  pressFillColor,
  pressLabelColor,
  pressAccentColor,
  accessibilityLabel,
}: AppButtonProps) {
  const pressProgress = useSharedValue(0);
  const animatePress = Boolean(pressFillColor && pressLabelColor);
  const animatePressAccent = Boolean(pressAccentColor);

  const setPressed = useCallback(
    (pressed: boolean) => {
      pressProgress.value = withTiming(pressed ? 1 : 0, pressTiming);
    },
    [pressProgress],
  );

  const animatedAccentContainerStyle = useAnimatedStyle(() => {
    if (!animatePressAccent || !pressAccentColor) {
      return {};
    }

    const pressed = pressProgress.value > 0;

    return {
      backgroundColor: colors.background,
      borderColor: pressed ? pressAccentColor : borderColor,
      borderWidth: 3,
    };
  }, [animatePressAccent, borderColor, pressAccentColor]);

  const animatedAccentTextStyle = useAnimatedStyle(() => {
    if (!animatePressAccent || !pressAccentColor) {
      return {};
    }

    return {
      color: interpolateColor(pressProgress.value, [0, 1], [textColor, pressAccentColor]),
    };
  }, [animatePressAccent, pressAccentColor, textColor]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    if (!animatePress || !pressFillColor) {
      return {};
    }

    const pressed = pressProgress.value > 0;

    return {
      backgroundColor: pressed ? pressFillColor : colors.background,
      borderColor: pressed ? pressFillColor : borderColor,
      borderWidth: 3,
    };
  }, [animatePress, borderColor, pressFillColor]);

  const animatedTextStyle = useAnimatedStyle(() => {
    if (!animatePress || !pressLabelColor) {
      return {};
    }

    return {
      color: interpolateColor(pressProgress.value, [0, 1], [textColor, pressLabelColor]),
    };
  }, [animatePress, pressLabelColor, textColor]);

  if (animatePressAccent) {
    return (
      <AnimatedPressable
        style={[
          globalStyles.appButton,
          { borderColor },
          disabled ? globalStyles.appButtonDisabled : null,
          style,
          disabled ? null : animatedAccentContainerStyle,
        ]}
        android_ripple={{ color: pressAccentColor }}
        onPress={onPress}
        onPressIn={() => {
          if (!disabled) {
            setPressed(true);
          }
        }}
        onPressOut={() => {
          if (!disabled) {
            setPressed(false);
          }
        }}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
      >
        <Animated.Text
          style={[
            globalStyles.appButtonText,
            { color: textColor },
            textStyle,
            disabled ? null : animatedAccentTextStyle,
          ]}
        >
          {title}
        </Animated.Text>
      </AnimatedPressable>
    );
  }

  if (animatePress) {
    return (
      <AnimatedPressable
        style={[
          globalStyles.appButton,
          { borderColor },
          disabled ? globalStyles.appButtonDisabled : null,
          style,
          disabled ? null : animatedContainerStyle,
        ]}
        android_ripple={{ color: pressFillColor }}
        onPress={onPress}
        onPressIn={() => {
          if (!disabled) {
            setPressed(true);
          }
        }}
        onPressOut={() => {
          if (!disabled) {
            setPressed(false);
          }
        }}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
      >
        <Animated.Text
          style={[
            globalStyles.appButtonText,
            { color: textColor },
            textStyle,
            disabled ? null : animatedTextStyle,
          ]}
        >
          {title}
        </Animated.Text>
      </AnimatedPressable>
    );
  }

  return (
    <Pressable
      style={[globalStyles.appButton, { borderColor }, disabled ? globalStyles.appButtonDisabled : null, style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <Text style={[globalStyles.appButtonText, { color: textColor }, textStyle]}>{title}</Text>
    </Pressable>
  );
}
