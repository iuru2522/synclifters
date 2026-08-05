import Svg, { Rect } from "react-native-svg";
import { colors, globalStyles, sizes } from "@/styles/global";

type CreateDayBurgerIconProps = {
  color?: string;
};

export function CreateDayBurgerIcon({
  color = colors.backArrow,
}: CreateDayBurgerIconProps) {
  return (
    <Svg
      width={sizes.createDayBurgerWidth}
      height={sizes.createDayBurgerHeight}
      viewBox="0 0 18 14"
      style={globalStyles.createDayBurgerIcon}
      accessibilityElementsHidden
    >
      <Rect x="0" y="0" width="18" height="2" rx="1" fill={color} />
      <Rect x="0" y="6" width="18" height="2" rx="1" fill={color} />
      <Rect x="0" y="12" width="18" height="2" rx="1" fill={color} />
    </Svg>
  );
}
