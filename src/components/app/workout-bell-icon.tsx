import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, globalStyles, sizes } from "@/styles/global";

const BELL_PATH =
  "M17.78 13C17.69 13 15.67 12.64 15.67 6.75C15.67 2.59 13.25 0 9.25 0C5.25 0 2.83 2.59 2.83 6.75C2.83 12.75 0.74 13 0.75 13C0.551088 13 0.360322 13.079 0.21967 13.2197C0.0790175 13.3603 0 13.5511 0 13.75C0 13.9489 0.0790175 14.1397 0.21967 14.2803C0.360322 14.421 0.551088 14.5 0.75 14.5H5.58C5.74694 15.3507 6.20423 16.117 6.87366 16.6678C7.54309 17.2186 8.38308 17.5198 9.25 17.5198C10.1169 17.5198 10.9569 17.2186 11.6263 16.6678C12.2958 16.117 12.7531 15.3507 12.92 14.5H17.76C17.9589 14.5 18.1497 14.421 18.2903 14.2803C18.431 14.1397 18.51 13.9489 18.51 13.75C18.51 13.5511 18.431 13.3603 18.2903 13.2197C18.1497 13.079 17.9589 13 17.76 13H17.78ZM9.25 16C8.7863 15.9991 8.3343 15.8544 7.95636 15.5857C7.57843 15.317 7.29319 14.9377 7.14 14.5H11.36C11.2068 14.9377 10.9216 15.317 10.5436 15.5857C10.1657 15.8544 9.7137 15.9991 9.25 16ZM3.01 13C3.73 11.91 4.33 10 4.33 6.75C4.33 3.5 6.13 1.5 9.25 1.5C12.37 1.5 14.17 3.41 14.17 6.75C14.17 10.09 14.77 11.91 15.49 13H3.01Z";

export function WorkoutBellIcon() {
  return (
    <View style={globalStyles.workoutBellWrap}>
      <Svg
        width={sizes.workoutBellWidth}
        height={sizes.workoutBellHeight}
        viewBox="0 0 19 18"
        style={globalStyles.workoutBellIcon}
        accessibilityElementsHidden
      >
        <Path d={BELL_PATH} fill={colors.inputFill} />
      </Svg>
      <View style={globalStyles.workoutBellBadge}>
        <Text style={globalStyles.workoutBellBadgeText}>1</Text>
      </View>
    </View>
  );
}
