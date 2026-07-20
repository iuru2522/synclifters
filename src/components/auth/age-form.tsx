import { View } from "react-native";
import { AgeWheelPicker } from "@/components/auth/age-wheel-picker";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

export function AgeForm() {
  const { age, setAge } = useOnboarding();

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
