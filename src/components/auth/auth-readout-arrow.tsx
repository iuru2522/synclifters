import { colors, globalStyles, sizes } from "@/styles/global";
import Svg, { Path } from "react-native-svg";
import type { StyleProp, ViewStyle } from "react-native";
import { getReadoutArrowPath } from "./readout-arrow-path";

export function AuthReadoutArrow({ style }: { style?: StyleProp<ViewStyle> }) {
  const width = sizes.authReadoutArrowWidth;
  const height = sizes.authReadoutArrowHeight;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={[globalStyles.authReadoutArrow, style]}
      accessibilityElementsHidden
    >
      <Path d={getReadoutArrowPath()} fill={colors.backArrow} />
    </Svg>
  );
}
