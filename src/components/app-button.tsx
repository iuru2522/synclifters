import { colors, globalStyles, sizes } from "@/styles/global";
import { type ReactNode, useCallback } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
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

const DEFAULT_BORDER_WIDTH = 3;

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  subtitleMeta?: string;
  subtitleMetaStyle?: StyleProp<TextStyle>;
  pressFillColor?: string;
  pressLabelColor?: string;
  pressAccentColor?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibilityLabel?: string;
};

function AppButtonLabel({
  title,
  textColor,
  textStyle,
  titleWithIconsStyle,
  subtitle,
  subtitleStyle,
  subtitleMeta,
  subtitleMetaStyle,
  animatedTitleStyle,
}: {
  title: string;
  textColor: string;
  textStyle?: StyleProp<TextStyle>;
  titleWithIconsStyle: StyleProp<TextStyle>;
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  subtitleMeta?: string;
  subtitleMetaStyle?: StyleProp<TextStyle>;
  animatedTitleStyle?: object;
}) {
  const titleNode = animatedTitleStyle ? (
    <Animated.Text
      style={[
        globalStyles.appButtonText,
        titleWithIconsStyle,
        { color: textColor },
        textStyle,
        animatedTitleStyle,
      ]}
    >
      {title}
    </Animated.Text>
  ) : (
    <Text
      style={[globalStyles.appButtonText, titleWithIconsStyle, { color: textColor }, textStyle]}
    >
      {title}
    </Text>
  );

  if (!subtitle) {
    return titleNode;
  }

  const subtitleNode = subtitleMeta ? (
    <View style={globalStyles.appButtonSubtitleRow}>
      <Text style={subtitleStyle}>{subtitle}</Text>
      <Text style={subtitleMetaStyle}>{subtitleMeta}</Text>
    </View>
  ) : (
    <Text style={subtitleStyle}>{subtitle}</Text>
  );

  return (
    <View style={globalStyles.appButtonLabelStack}>
      {titleNode}
      {subtitleNode}
    </View>
  );
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  borderColor = colors.backArrow,
  borderWidth = DEFAULT_BORDER_WIDTH,
  textColor = colors.inputFill,
  style,
  textStyle,
  subtitle,
  subtitleStyle,
  subtitleMeta,
  subtitleMetaStyle,
  pressFillColor,
  pressLabelColor,
  pressAccentColor,
  leftIcon,
  rightIcon,
  accessibilityLabel,
}: AppButtonProps) {
  const pressProgress = useSharedValue(0);
  const animatePress = Boolean(pressFillColor && pressLabelColor);
  const animatePressAccent = Boolean(pressAccentColor);
  const withIcon = Boolean(leftIcon || rightIcon);
  const titleWithIconsStyle = withIcon && !subtitle ? globalStyles.appButtonTitleWithIcons : null;

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
      borderWidth,
    };
  }, [animatePressAccent, borderColor, borderWidth, pressAccentColor]);

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
      borderWidth,
    };
  }, [animatePress, borderColor, borderWidth, pressFillColor]);

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
          withIcon ? globalStyles.appButtonWithIcon : null,
          { borderColor, borderWidth },
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
        {leftIcon}
        <AppButtonLabel
          title={title}
          textColor={textColor}
          textStyle={textStyle}
          titleWithIconsStyle={titleWithIconsStyle}
          subtitle={subtitle}
          subtitleStyle={subtitleStyle}
          subtitleMeta={subtitleMeta}
          subtitleMetaStyle={subtitleMetaStyle}
          animatedTitleStyle={disabled ? undefined : animatedAccentTextStyle}
        />
        {rightIcon}
      </AnimatedPressable>
    );
  }

  if (animatePress) {
    return (
      <AnimatedPressable
        style={[
          globalStyles.appButton,
          withIcon ? globalStyles.appButtonWithIcon : null,
          { borderColor, borderWidth },
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
        {leftIcon}
        <AppButtonLabel
          title={title}
          textColor={textColor}
          textStyle={textStyle}
          titleWithIconsStyle={titleWithIconsStyle}
          subtitle={subtitle}
          subtitleStyle={subtitleStyle}
          subtitleMeta={subtitleMeta}
          subtitleMetaStyle={subtitleMetaStyle}
          animatedTitleStyle={disabled ? undefined : animatedTextStyle}
        />
        {rightIcon}
      </AnimatedPressable>
    );
  }

  return (
    <Pressable
      style={[
        globalStyles.appButton,
        withIcon ? globalStyles.appButtonWithIcon : null,
        { borderColor, borderWidth },
        disabled ? globalStyles.appButtonDisabled : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      {leftIcon}
      <AppButtonLabel
        title={title}
        textColor={textColor}
        textStyle={textStyle}
        titleWithIconsStyle={titleWithIconsStyle}
        subtitle={subtitle}
        subtitleStyle={subtitleStyle}
        subtitleMeta={subtitleMeta}
        subtitleMetaStyle={subtitleMetaStyle}
      />
      {rightIcon}
    </Pressable>
  );
}
