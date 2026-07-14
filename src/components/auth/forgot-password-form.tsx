import { useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { AuthCard, authCardStyles } from "./auth-card";

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
    <AuthCard>
      <Text style={authCardStyles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        editable={!isDisabled}
      />

      <Button
        title={submitting ? "Sending..." : "Send Reset Link"}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isDisabled}
      />

      <View style={styles.signupRow}>
        <Text style={styles.signupPrompt}>Don't Have an Account? </Text>
        <Link href="/sign-up-role" asChild>
          <Pressable disabled={isDisabled} accessibilityRole="link" accessibilityLabel="Get Started">
            <Text style={styles.signupLink}>Get Started</Text>
          </Pressable>
        </Link>
      </View>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  signupRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  signupPrompt: {
    color: "#4b5563",
    fontSize: 14,
  },
  signupLink: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
});
