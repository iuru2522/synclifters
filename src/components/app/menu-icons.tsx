import Svg, { Path, Rect } from "react-native-svg";
import { colors, sizes } from "@/styles/global";

type MenuIconProps = {
  color?: string;
};

export function MenuCalculatorIcon({ color = colors.backArrow }: MenuIconProps) {
  return (
    <Svg
      width={sizes.menuIconSize}
      height={sizes.menuIconSize}
      viewBox="0 0 40 40"
      accessibilityElementsHidden
    >
      <Rect x="8" y="6" width="24" height="28" rx="3" stroke={color} strokeWidth="2" fill="none" />
      <Rect x="12" y="10" width="6" height="4" rx="1" fill={color} />
      <Rect x="20" y="10" width="6" height="4" rx="1" fill={color} />
      <Rect x="28" y="10" width="0" height="0" fill={color} />
      <Rect x="12" y="18" width="6" height="4" rx="1" fill={color} />
      <Rect x="20" y="18" width="6" height="4" rx="1" fill={color} />
      <Rect x="28" y="18" width="4" height="4" rx="1" fill={color} />
      <Rect x="12" y="26" width="6" height="4" rx="1" fill={color} />
      <Rect x="20" y="26" width="6" height="4" rx="1" fill={color} />
      <Rect x="28" y="26" width="4" height="4" rx="1" fill={color} />
    </Svg>
  );
}

export function MenuProgressIcon({ color = colors.backArrow }: MenuIconProps) {
  return (
    <Svg
      width={sizes.menuIconSize}
      height={sizes.menuIconSize}
      viewBox="0 0 40 40"
      accessibilityElementsHidden
    >
      <Path d="M20 8L28 18H22V32H18V18H12L20 8Z" fill={color} />
      <Path d="M20 32L12 22H18V8H22V22H28L20 32Z" fill={color} opacity="0.55" />
    </Svg>
  );
}

export function MenuProgramsIcon({ color = colors.backArrow }: MenuIconProps) {
  return (
    <Svg
      width={sizes.menuIconSize}
      height={sizes.menuIconSize}
      viewBox="0 0 40 40"
      accessibilityElementsHidden
    >
      <Path
        d="M12 8H24L30 14V32C30 33.1 29.1 34 28 34H12C10.9 34 10 33.1 10 32V10C10 8.9 10.9 8 12 8Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Path d="M24 8V14H30" stroke={color} strokeWidth="2" fill="none" />
      <Path
        d="M26 24L30 28L26 32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M18 28H30" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function MenuNotificationsIcon({ color = colors.backArrow }: MenuIconProps) {
  return (
    <Svg
      width={sizes.menuIconSize}
      height={sizes.menuIconSize}
      viewBox="0 0 40 40"
      accessibilityElementsHidden
    >
      <Path
        d="M20 6C15.03 6 11 10.03 11 15V21L9 25H31L29 21V15C29 10.03 24.97 6 20 6Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Path d="M16 29C16 31.21 17.79 33 20 33C22.21 33 24 31.21 24 29" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  );
}

export function MenuSettingsIcon({ color = colors.backArrow }: MenuIconProps) {
  return (
    <Svg
      width={sizes.menuIconSize}
      height={sizes.menuIconSize}
      viewBox="0 0 40 40"
      accessibilityElementsHidden
    >
      <Path
        d="M16.2 6.5L17.4 9.8C18.2 10.1 19 10.5 19.7 11L22.6 9.9L25.5 14.3L23.1 16.7C23.2 17.5 23.2 18.3 23.1 19.1L25.5 21.5L22.6 25.9L19.7 24.8C19 25.3 18.2 25.7 17.4 26L16.2 29.3H11.8L10.6 26C9.8 25.7 9 25.3 8.3 24.8L5.4 25.9L2.5 21.5L4.9 19.1C4.8 18.3 4.8 17.5 4.9 16.7L2.5 14.3L5.4 9.9L8.3 11C9 10.5 9.8 10.1 10.6 9.8L11.8 6.5H16.2Z"
        transform="translate(8 5) scale(0.95)"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <Path
        d="M14 14C15.66 14 17 15.34 17 17C17 18.66 15.66 20 14 20C12.34 20 11 18.66 11 17C11 15.34 12.34 14 14 14Z"
        transform="translate(8 5) scale(0.95)"
        fill={color}
      />
    </Svg>
  );
}
