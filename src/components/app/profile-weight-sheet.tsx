import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { AppButton } from "@/components/app-button";
import {
  clampWeight,
  getWeightRulerConfig,
  roundToWeightStep,
} from "@/components/auth/weight-ruler-units";
import type { WeightUnit } from "@/components/auth/weight-unit-toggle";
import { colors, globalStyles, sizes } from "@/styles/global";

function buildWeightOptions(unit: WeightUnit) {
  const config = getWeightRulerConfig(unit);
  const options: number[] = [];

  for (let value = config.min; value <= config.max; value += config.step) {
    options.push(roundToWeightStep(value, config.step));
  }

  return options;
}

export type ProfileWeightSheetProps = {
  initialWeight: number;
  unit: WeightUnit;
  onSave: (weight: number) => Promise<void>;
};

export function ProfileWeightSheet({
  initialWeight,
  unit,
  onSave,
}: ProfileWeightSheetProps) {
  const router = useRouter();
  const [weight, setWeight] = useState(() => {
    const config = getWeightRulerConfig(unit);
    return clampWeight(roundToWeightStep(initialWeight, config.step), config);
  });
  const [submitting, setSubmitting] = useState(false);
  const options = useMemo(() => buildWeightOptions(unit), [unit]);
  const unitLabel = unit === "kg" ? "kg" : "lb";

  const dismiss = () => {
    if (!submitting) {
      router.back();
    }
  };

  const handleSave = async () => {
    setSubmitting(true);

    try {
      await onSave(weight);
      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save changes.";
      Alert.alert("Save failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.profileFieldSheetRoot}>
      <Pressable
        style={globalStyles.profileFieldSheetBackdrop}
        onPress={dismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View style={globalStyles.profileWeekDaySheetPanel}>
        <Picker
          selectedValue={weight}
          onValueChange={(nextValue) => {
            setWeight(nextValue);
          }}
          enabled={!submitting}
          style={globalStyles.profileWeekDayPicker}
          itemStyle={globalStyles.profileWeekDayPickerItem}
          accessibilityLabel="Weight"
        >
          {options.map((option) => (
            <Picker.Item
              key={`${unit}-${option}`}
              label={`${option} ${unitLabel}`}
              value={option}
              color={colors.backArrow}
            />
          ))}
        </Picker>
        <AppButton
          title={submitting ? "Saving..." : "Save Changes"}
          onPress={() => {
            void handleSave();
          }}
          disabled={submitting}
          borderColor={colors.white}
          pressAccentColor={colors.backArrow}
        />
      </View>
    </View>
  );
}

export function resolveProfileWeight(
  weight: number | null | undefined,
  unit: WeightUnit | null | undefined,
) {
  return {
    weight: typeof weight === "number" ? weight : sizes.weightRulerDefault,
    unit: unit === "lb" ? ("lb" as const) : ("kg" as const),
  };
}
