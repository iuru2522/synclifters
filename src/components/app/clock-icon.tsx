import Svg, { Circle, Path } from "react-native-svg";
import { colors, globalStyles, sizes } from "@/styles/global";

type ClockIconProps = {
  color?: string;
};

export function ClockIcon({ color = colors.inputFill }: ClockIconProps) {
  return (
    <Svg
      width={sizes.programDayExerciseTimerIcon}
      height={sizes.programDayExerciseTimerIcon}
      viewBox="0 0 24 24"
      style={globalStyles.clockIcon}
      accessibilityElementsHidden
    >
      <Circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
      />
      <Path
        d="M12 7v5h4"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
