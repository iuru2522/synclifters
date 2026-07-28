import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles, spacing } from "@/styles/global";

export type ProfileFieldSheetProps = {
  label: string;
  placeholder: string;
  initialValue: string;
  accessibilityLabel?: string;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  keyboardType?: KeyboardTypeOptions;
  emptyErrorTitle?: string;
  emptyErrorMessage?: string;
  onSave: (value: string) => Promise<void>;
};

export function ProfileFieldSheet({
  label,
  placeholder,
  initialValue,
  accessibilityLabel = label,
  autoCapitalize = "none",
  autoComplete,
  textContentType,
  keyboardType = "default",
  emptyErrorTitle = "Required",
  emptyErrorMessage = "Please enter a value.",
  onSave,
}: ProfileFieldSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bottomPadding = Math.max(insets.bottom, spacing.safeAreaBottomMin);

  const dismiss = () => {
    if (!submitting) {
      router.back();
    }
  };

  const handleSave = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      Alert.alert(emptyErrorTitle, emptyErrorMessage);
      return;
    }

    setSubmitting(true);

    try {
      await onSave(trimmed);
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
      <View
        style={[
          globalStyles.profileFieldSheetPanel,
          { paddingBottom: bottomPadding + spacing.tabContent },
        ]}
      >
        <View style={[globalStyles.authResultCardShadow, globalStyles.authInputsCardShadow]}>
          <View style={globalStyles.signUpInputsCard}>
            <View style={globalStyles.signUpCardFields}>
              <View style={globalStyles.signUpInputGroup}>
                <View style={globalStyles.authFormField}>
                  <Text style={globalStyles.signUpInputLabel}>{label}</Text>
                  <TextInput
                    style={[
                      globalStyles.input,
                      globalStyles.signUpInput,
                      focused ? globalStyles.authInputFocused : null,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.inputPlaceholder}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                    keyboardType={keyboardType}
                    value={value}
                    onChangeText={setValue}
                    onFocus={() => {
                      setFocused(true);
                    }}
                    onBlur={() => {
                      setFocused(false);
                    }}
                    editable={!submitting}
                    accessibilityLabel={accessibilityLabel}
                  />
                </View>
              </View>
            </View>
          </View>
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
