import Svg, { Circle, Path } from "react-native-svg";
import { colors, globalStyles, sizes } from "@/styles/global";

type StopwatchIconProps = {
  color?: string;
};

export function StopwatchIcon({ color = colors.backArrow }: StopwatchIconProps) {
  return (
    <Svg
      width={sizes.programDayExerciseTimerIcon}
      height={sizes.programDayExerciseTimerIcon}
      viewBox="0 0 24 24"
      style={globalStyles.stopwatchIcon}
      accessibilityElementsHidden
    >
      <Circle
        cx="12"
        cy="13"
        r="8"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
      />
      <Path
        d="M10 2h4"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
      />
      <Path
        d="M12 2v3"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
      />
      <Path
        d="M18.5 5.5l1.5 1.5"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
      />
      <Path
        d="M12 9v4l2.5 1.5"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
