import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { AppButton } from "@/components/app-button";
import type { UserSportsExperience } from "@/features/users/user-profile";
import { colors, globalStyles } from "@/styles/global";

const EXPERIENCE_OPTIONS: { label: string; value: UserSportsExperience }[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Gym Rat", value: "gym-rat" },
  { label: "Beast Mode", value: "beast-mode" },
];

export type ProfileSportsExperienceSheetProps = {
  initialValue: UserSportsExperience;
  onSave: (value: UserSportsExperience) => Promise<void>;
};

export function ProfileSportsExperienceSheet({
  initialValue,
  onSave,
}: ProfileSportsExperienceSheetProps) {
  const router = useRouter();
  const [value, setValue] = useState<UserSportsExperience>(initialValue);
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
          accessibilityLabel="Sports experience"
        >
          {EXPERIENCE_OPTIONS.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
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
