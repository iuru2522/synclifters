import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { AppButton } from "@/components/app-button";
import {
  clampHeight,
  formatHeightUnitLabel,
  getHeightRulerConfig,
  roundToHeightStep,
} from "@/components/auth/height-ruler-units";
import type { WeightUnit } from "@/components/auth/weight-unit-toggle";
import { colors, globalStyles, sizes } from "@/styles/global";

function buildHeightOptions(unit: WeightUnit) {
  const config = getHeightRulerConfig(unit);
  const options: number[] = [];

  for (let value = config.min; value <= config.max; value += config.step) {
    options.push(roundToHeightStep(value, config.step));
  }

  return options;
}

export type ProfileHeightSheetProps = {
  initialHeight: number;
  unit: WeightUnit;
  onSave: (height: number) => Promise<void>;
};

export function ProfileHeightSheet({
  initialHeight,
  unit,
  onSave,
}: ProfileHeightSheetProps) {
  const router = useRouter();
  const [height, setHeight] = useState(() => {
    const config = getHeightRulerConfig(unit);
    return clampHeight(roundToHeightStep(initialHeight, config.step), config);
  });
  const [submitting, setSubmitting] = useState(false);
  const options = useMemo(() => buildHeightOptions(unit), [unit]);
  const unitLabel = formatHeightUnitLabel(unit);

  const dismiss = () => {
    if (!submitting) {
      router.back();
    }
  };

  const handleSave = async () => {
    setSubmitting(true);

    try {
      await onSave(height);
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
          selectedValue={height}
          onValueChange={(nextValue) => {
            setHeight(nextValue);
          }}
          enabled={!submitting}
          style={globalStyles.profileWeekDayPicker}
          itemStyle={globalStyles.profileWeekDayPickerItem}
          accessibilityLabel="Height"
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

export function resolveProfileHeight(
  height: number | null | undefined,
  unit: WeightUnit | null | undefined,
) {
  return {
    height: typeof height === "number" ? height : sizes.heightRulerDefault,
    unit: unit === "lb" ? ("lb" as const) : ("kg" as const),
  };
}
