import { Image } from "expo-image";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { colors, globalStyles } from "@/styles/global";

const wrenchIcon = require("../../../assets/images/wrench-icon.png");

type AuthResultWrenchIconProps = {
  tintColor?: string;
  accessibilityLabel?: string;
  showShadow?: boolean;
  circleStyle?: StyleProp<ViewStyle>;
  innerCircleStyle?: StyleProp<ViewStyle>;
};

export function AuthResultWrenchIcon({
  tintColor = colors.backArrow,
  accessibilityLabel = "Status icon",
  showShadow = true,
  circleStyle,
  innerCircleStyle,
}: AuthResultWrenchIconProps) {
  return (
    <View
      style={[
        showShadow ? globalStyles.authResultIconCircleShadow : globalStyles.authResultIconCircleWrap,
        circleStyle,
      ]}
    >
      <View style={[globalStyles.successCardIconCircle, innerCircleStyle]}>
        <Image
          source={wrenchIcon}
          style={globalStyles.successCardIcon}
          tintColor={tintColor}
          contentFit="contain"
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    </View>
  );
}
