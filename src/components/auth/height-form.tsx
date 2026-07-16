import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useMeasurementUnit } from "@/features/onboarding/measurement-unit-context";
import { globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";
import { HeightRulerPicker } from "./height-ruler-picker";
import { convertHeight, getHeightRulerConfig } from "./height-ruler-units";

export function HeightForm() {
  const { unit } = useMeasurementUnit();
  const config = getHeightRulerConfig(unit);
  const [height, setHeight] = useState(config.default);
  const prevUnitRef = useRef(unit);

  useEffect(() => {
    if (prevUnitRef.current === unit) {
      return;
    }

    setHeight((current) => convertHeight(current, prevUnitRef.current, unit));
    prevUnitRef.current = unit;
  }, [unit]);

  return (
    <View style={globalStyles.heightScreen}>
      <View style={globalStyles.heightHeader}>
        <AuthBackButton href="/age" title="Height" gap={spacing.authBackTitleHeight} />
        <HeightRulerPicker value={height} unit={unit} onChange={setHeight} />
      </View>
    </View>
  );
}
