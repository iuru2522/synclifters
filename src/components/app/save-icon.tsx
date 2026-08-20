import Svg, { Path } from "react-native-svg";
import { colors, globalStyles, sizes } from "@/styles/global";

type SaveIconProps = {
  color?: string;
};

export function SaveIcon({ color = colors.backArrow }: SaveIconProps) {
  return (
    <Svg
      width={sizes.saveIconWidth}
      height={sizes.saveIconHeight}
      viewBox="0 0 24 24"
      style={globalStyles.saveIcon}
      accessibilityElementsHidden
    >
      <Path
        d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 3v4a1 1 0 0 0 1 1h7"
        fill="none"
        stroke={color}
        strokeWidth={sizes.saveIconStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
