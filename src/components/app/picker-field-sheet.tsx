import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles } from "@/styles/global";

export type PickerOption<T extends string | number> = {
  label: string;
  value: T;
};

export type PickerFieldSheetProps<T extends string | number> = {
  initialValue: T;
  options: readonly PickerOption<T>[] | readonly T[];
  accessibilityLabel: string;
  onSave: (value: T) => Promise<void>;
  saveTitle?: string;
  savingTitle?: string;
};

function isPickerOption<T extends string | number>(
  option: PickerOption<T> | T,
): option is PickerOption<T> {
  return typeof option === "object" && option !== null && "value" in option;
}

function normalizeOptions<T extends string | number>(
  options: readonly PickerOption<T>[] | readonly T[],
): PickerOption<T>[] {
  return options.map((option) =>
    isPickerOption(option) ? option : { label: String(option), value: option },
  );
}

export function PickerFieldSheet<T extends string | number>({
  initialValue,
  options,
  accessibilityLabel,
  onSave,
  saveTitle = "Save Changes",
  savingTitle = "Saving...",
}: PickerFieldSheetProps<T>) {
  const router = useRouter();
  const [value, setValue] = useState<T>(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const pickerOptions = normalizeOptions(options);

  const dismiss = () => {
    if (!submitting) {
      router.back();
    }
  };

  const handleSave = async () => {
    setSubmitting(true);

    try {
      await onSave(value);
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
          selectedValue={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
          }}
          enabled={!submitting}
          style={globalStyles.profileWeekDayPicker}
          itemStyle={globalStyles.profileWeekDayPickerItem}
          accessibilityLabel={accessibilityLabel}
        >
          {pickerOptions.map((option) => (
            <Picker.Item
              key={String(option.value)}
              label={option.label}
              value={option.value}
              color={colors.backArrow}
            />
          ))}
        </Picker>
        <AppButton
          title={submitting ? savingTitle : saveTitle}
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
