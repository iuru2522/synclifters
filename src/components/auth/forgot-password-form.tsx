import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { AppButton } from "@/components/app-button";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

type ForgotPasswordFormProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

type ForgotPasswordField = "email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm({
  disabled = false,
  onSubmittingChange,
}: ForgotPasswordFormProps) {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [focusedField, setFocusedField] = useState<ForgotPasswordField | null>(null);

  const trimmedEmail = email.trim();
  const emailFormatInvalid = trimmedEmail.length > 0 && !EMAIL_PATTERN.test(trimmedEmail);
  const emailEmpty = trimmedEmail.length === 0;
  const emailInvalid = emailEmpty || !EMAIL_PATTERN.test(trimmedEmail);
  const showEmailError = emailFormatInvalid || (showFieldErrors && emailEmpty);

  function getInputBorderStyle(field: ForgotPasswordField, showError: boolean) {
    if (showError) {
      return globalStyles.authInputError;
    }

    if (focusedField === field) {
      return globalStyles.authInputFocused;
    }

    return null;
  }

  async function handleSubmit() {
    setShowFieldErrors(true);

    if (emailInvalid) {
      return;
    }

    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await sendPasswordReset(email);
      Alert.alert(
        "Check your email",
        "If an account exists for that address, a password reset link has been sent.",
      );
    } catch (error) {
      const message =
        error instanceof AuthServiceError
          ? error.message
          : "Failed to send password reset email.";

      Alert.alert("Reset failed", message);
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  const isDisabled = disabled || submitting;

  return (
    <View style={globalStyles.forgotPasswordScreen}>
      <View style={globalStyles.forgotPasswordHeader}>
        <AuthBackButton href="/sign-in" title="Forgot Password?" />

        <View style={globalStyles.authInputsCardShadow}>
          <View style={[globalStyles.signUpInputsCard, globalStyles.forgotPasswordInputsCard]}>
          <View style={globalStyles.authFormField}>
            <Text style={globalStyles.signUpInputLabel}>Email</Text>
            <TextInput
              style={[
                globalStyles.input,
                globalStyles.signUpInput,
                getInputBorderStyle("email", showEmailError),
              ]}
              placeholder="enter email"
              placeholderTextColor={colors.inputPlaceholder}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              onFocus={() => {
                setFocusedField("email");
              }}
              onBlur={() => {
                setFocusedField((current) => (current === "email" ? null : current));
              }}
              editable={!isDisabled}
              accessibilityLabel="Email"
            />
          </View>
        </View>
        </View>
      </View>

      <View style={globalStyles.forgotPasswordFormContent}>
        <AppButton
          title={submitting ? "Sending..." : "Send Reset Link"}
          onPress={() => {
            void handleSubmit();
          }}
          disabled={isDisabled}
          borderColor={colors.resetButtonBorder}
          pressFillColor={colors.resetButtonBorder}
          pressLabelColor={colors.inputText}
        />
      </View>
    </View>
  );
}
