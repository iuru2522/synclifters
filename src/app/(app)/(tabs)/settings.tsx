import { View } from "react-native";
import { MenuOverlay } from "@/components/app/menu-overlay";
import { globalStyles } from "@/styles/global";

export default function SettingsScreen() {
  return (
    <View style={globalStyles.screen}>
      <MenuOverlay />
    </View>
  );
}
