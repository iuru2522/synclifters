import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { AppButton } from "@/components/app-button";
import {
  MUSCLE_GROUP_OPTIONS,
  type MuscleGroup,
} from "@/features/workout/custom-exercise-muscle";
import { colors, globalStyles } from "@/styles/global";

export type CustomExerciseMuscleSheetProps = {
  initialValue: MuscleGroup;
  onSave: (value: MuscleGroup) => Promise<void>;
};

export function CustomExerciseMuscleSheet({
  initialValue,
  onSave,
}: CustomExerciseMuscleSheetProps) {
  const router = useRouter();
  const [value, setValue] = useState<MuscleGroup>(initialValue);
  const [submitting, setSubmitting] = useState(false);

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
          accessibilityLabel="Muscle"
        >
          {MUSCLE_GROUP_OPTIONS.map((option) => (
            <Picker.Item
              key={option}
              label={option}
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
