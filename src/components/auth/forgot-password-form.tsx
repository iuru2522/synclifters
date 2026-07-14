import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

type ForgotPasswordFormProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function ForgotPasswordForm({
  disabled = false,
  onSubmittingChange,
}: ForgotPasswordFormProps) {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
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
    <View style={globalStyles.card}>
      <AuthBackButton href="/sign-in" />

      <View>
        <Text style={globalStyles.heroTitle}>Forgot Password</Text>
        <Text style={globalStyles.heroSubtitle}>
          Reset your <Text style={globalStyles.brandAccent}>SL</Text> password
        </Text>
      </View>


      <View style={globalStyles.field}>
        <Text style={globalStyles.label}>Email</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Enter Email"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          editable={!isDisabled}
        />
      </View>

      <Pressable
        style={[globalStyles.primaryButton, isDisabled ? globalStyles.primaryButtonDisabled : null]}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel="Send Reset Link"
      >
        <Text style={globalStyles.primaryButtonText}>
          {submitting ? "Sending..." : "Send Reset Link"}
        </Text>
      </Pressable>

      <View style={globalStyles.promptRow}>
        <Text style={globalStyles.promptText}>Don't Have an Account? </Text>
        <Link href="/sign-up-role" asChild>
          <Pressable disabled={isDisabled} accessibilityRole="link" accessibilityLabel="Get Started">
            <Text style={globalStyles.promptLink}>Get Started</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
