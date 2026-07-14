import { Text, View } from "react-native";
import { globalStyles } from "@/styles/global";

export function SyncLiftersLogo() {
  return (
    <View style={globalStyles.brandLogo} accessibilityRole="header" accessibilityLabel="SyncLifters">
      <Text style={globalStyles.brandMark}>SL</Text>
      <Text style={globalStyles.brandName}>SyncLifters</Text>
    </View>
  );
}
