import { View } from "react-native";
import { MenuOverlay } from "@/components/app/menu-overlay";
import { WorkoutTabScreen } from "@/components/app/workout-tab-screen";
import { globalStyles } from "@/styles/global";

export default function SettingsScreen() {
  return (
    <View style={globalStyles.screen}>
      <WorkoutTabScreen />
      <MenuOverlay />
    </View>
  );
}
