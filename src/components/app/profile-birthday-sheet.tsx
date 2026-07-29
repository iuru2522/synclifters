import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles } from "@/styles/global";

export type ProfileBirthdaySheetProps = {
  initialDate: Date;
  onSave: (date: Date) => Promise<void>;
};

export function ProfileBirthdaySheet({ initialDate, onSave }: ProfileBirthdaySheetProps) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [submitting, setSubmitting] = useState(false);
  const maximumDate = new Date();

  const dismiss = () => {
    if (!submitting) {
      router.back();
    }
  };

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);

    try {
      await onSave(date);
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
      <View style={globalStyles.profileBirthdaySheetPanel}>
        <View style={globalStyles.profileBirthdayCalendar}>
          <DateTimePicker
            value={date}
            mode="date"
            display={process.env.EXPO_OS === "ios" ? "inline" : "calendar"}
            onChange={handleChange}
            maximumDate={maximumDate}
            themeVariant="dark"
            accentColor={colors.backArrow}
            style={globalStyles.profileBirthdayCalendarPicker}
            disabled={submitting}
          />
        </View>
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
