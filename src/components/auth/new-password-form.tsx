import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/app-button";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

type NewPasswordFormProps = {
  oobCode?: string;
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

type NewPasswordField = "password" | "confirmPassword";

function isValidPassword(value: string) {
  return (
    value.length >= 8 &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export function NewPasswordForm({
  oobCode = "",
  disabled = false,
  onSubmittingChange,
}: NewPasswordFormProps) {
  const { setNewPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [focusedField, setFocusedField] = useState<NewPasswordField | null>(null);

  const passwordInvalid = !isValidPassword(password);
  const confirmPasswordInvalid =
    confirmPassword.length === 0 || confirmPassword !== password;

  function getInputBorderStyle(field: NewPasswordField, invalid: boolean) {
    if (focusedField === field) {
      return globalStyles.authInputFocused;
    }

    if (showFieldErrors && invalid) {
      return globalStyles.authInputError;
    }

    return null;
  }

  async function handleSubmit() {
    setShowFieldErrors(true);

    if (passwordInvalid || confirmPasswordInvalid) {
      return;
    }

    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      const code = oobCode.trim();

      if (code) {
        await setNewPassword(code, password);
      } else if (!__DEV__) {
        throw new AuthServiceError(
          "This reset link is missing or invalid. Request a new one.",
          "OOB_CODE_REQUIRED",
        );
      }

      router.replace("/success");
    } catch (error) {
      const message =
        error instanceof AuthServiceError ? error.message : "Failed to set a new password.";

      Alert.alert("Reset failed", message);
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  const isDisabled = disabled || submitting;

  return (
    <View style={globalStyles.newPasswordScreen}>
      <View style={globalStyles.newPasswordHeader}>
        <AuthBackButton href="/sign-in" title="New Password" gap={spacing.authBackTitleNewPassword} />

        <View style={globalStyles.authInputsCardShadow}>
          <View style={[globalStyles.signUpInputsCard, globalStyles.newPasswordInputsCard]}>
          <View style={globalStyles.signUpInputGroup}>
            <View style={globalStyles.authFormField}>
              <Text style={globalStyles.signUpInputLabel}>New Password</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  globalStyles.signUpInput,
                  getInputBorderStyle("password", passwordInvalid),
                ]}
                placeholder="**************"
                placeholderTextColor={colors.inputPlaceholder}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                value={password}
                onChangeText={setPassword}
                onFocus={() => {
                  setFocusedField("password");
                }}
                onBlur={() => {
                  setFocusedField((current) => (current === "password" ? null : current));
                }}
                editable={!isDisabled}
                accessibilityLabel="New Password"
              />
            </View>

            <View style={globalStyles.authFormField}>
              <Text style={globalStyles.signUpInputLabel}>Confirm Password</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  globalStyles.signUpInput,
                  getInputBorderStyle("confirmPassword", confirmPasswordInvalid),
                ]}
                placeholder="**************"
                placeholderTextColor={colors.inputPlaceholder}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => {
                  setFocusedField("confirmPassword");
                }}
                onBlur={() => {
                  setFocusedField((current) => (current === "confirmPassword" ? null : current));
                }}
                editable={!isDisabled}
                accessibilityLabel="Confirm Password"
              />
            </View>
          </View>
        </View>
        </View>
      </View>

      <View style={globalStyles.newPasswordFormContent}>
        <AppButton
          title={submitting ? "Saving..." : "Set Password"}
          onPress={() => {
            void handleSubmit();
          }}
          disabled={isDisabled}
          pressFillColor={colors.backArrow}
          pressLabelColor={colors.inputText}
        />

      </View>
    </View>
  );
}
