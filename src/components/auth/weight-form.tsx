import { useCallback } from "react";
import { View } from "react-native";
import { useMeasurementUnit } from "@/features/onboarding/measurement-unit-context";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";
import { WeightRulerPicker } from "./weight-ruler-picker";
import { convertWeight } from "./weight-ruler-units";
import { WeightUnitToggle, type WeightUnit } from "./weight-unit-toggle";

export function WeightForm() {
  const { unit, setUnit } = useMeasurementUnit();
  const { weight, setWeight } = useOnboarding();

  const handleUnitChange = useCallback(
    (nextUnit: WeightUnit) => {
      if (nextUnit === unit) {
        return;
      }

      setWeight(convertWeight(weight, unit, nextUnit));
      setUnit(nextUnit);
    },
    [setUnit, setWeight, unit, weight],
  );

  return (
    <View style={globalStyles.weightScreen}>
      <View style={globalStyles.weightHeader}>
        <AuthBackButton href="/gender" title="Weight" gap={spacing.authBackTitleWeight} />
        <View style={globalStyles.weightHeaderToToggleGap} />
        <View style={globalStyles.weightUnitToggleWrap}>
          <WeightUnitToggle value={unit} onChange={handleUnitChange} />
        </View>
        <WeightRulerPicker value={weight} unit={unit} onChange={setWeight} />
      </View>
    </View>
  );
}
