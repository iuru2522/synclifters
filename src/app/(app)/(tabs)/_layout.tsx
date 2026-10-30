import { NativeTabs } from "expo-router/unstable-native-tabs";
import { View } from "react-native";
import { colors, globalStyles } from "@/styles/global";

const tabBarLabelStyle = globalStyles.tabBarLabel;
const tabBarLabelActiveStyle = globalStyles.tabBarLabelActive;

const tabIcons = {
  history: {
    default: require("../../../../assets/images/tabIcons/book-inactive.png"),
    selected: require("../../../../assets/images/tabIcons/book-active.png"),
  },
  workout: {
    default: require("../../../../assets/images/tabIcons/home-inactive.png"),
    selected: require("../../../../assets/images/tabIcons/home-active.png"),
  },
  menu: {
    default: require("../../../../assets/images/tabIcons/qrcode-inactive.png"),
    selected: require("../../../../assets/images/tabIcons/qrcode-active.png"),
  },
} as const;

export default function TabsLayout() {
  return (
    <View style={globalStyles.screen}>
      <NativeTabs
        labelStyle={{
          default: tabBarLabelStyle,
          selected: tabBarLabelActiveStyle,
        }}
        iconColor={{
          default: colors.tabBarInactive,
          selected: colors.backArrow,
        }}
        tintColor={colors.backArrow}
      >
        <NativeTabs.Trigger name="history">
          <NativeTabs.Trigger.Icon src={tabIcons.history} renderingMode="original" />
          <NativeTabs.Trigger.Label selectedStyle={tabBarLabelActiveStyle}>
            History
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="workout">
          <NativeTabs.Trigger.Icon src={tabIcons.workout} renderingMode="original" />
          <NativeTabs.Trigger.Label selectedStyle={tabBarLabelActiveStyle}>
            Workout
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Icon src={tabIcons.menu} renderingMode="original" />
          <NativeTabs.Trigger.Label selectedStyle={tabBarLabelActiveStyle}>
            Menu
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}
