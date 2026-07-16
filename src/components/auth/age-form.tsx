import { useState } from "react";
import { View } from "react-native";
import { AgeWheelPicker } from "@/components/auth/age-wheel-picker";
import { globalStyles, sizes, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

export function AgeForm() {
  const [age, setAge] = useState<number>(sizes.ageWheelDefault);

  return (
    <View style={globalStyles.ageScreen}>
      <View style={globalStyles.ageHeader}>
        <AuthBackButton href="/weight" title="Age" gap={spacing.authBackTitleAge} />
        <View style={globalStyles.ageHeaderToSelectionGap} />
        <AgeWheelPicker value={age} onChange={setAge} />
      </View>
    </View>
  );
}
