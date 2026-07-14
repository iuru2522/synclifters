import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { AuthCard, authCardStyles } from "./auth-card";

type NewPasswordFormProps = {
  oobCode?: string;
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function NewPasswordForm({
  oobCode = "",
  disabled = false,
  onSubmittingChange,
}: NewPasswordFormProps) {
  const { setNewPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Make sure both password fields are the same.");
      return;
    }

    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await setNewPassword(oobCode, password);
      Alert.alert("Password updated", "You can now log in with your new password.", [
        {
          text: "Log In",
          onPress: () => router.replace("/sign-in"),
        },
      ]);
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
    <AuthCard>
      <Text style={authCardStyles.title}>New Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        value={password}
        onChangeText={setPassword}
        editable={!isDisabled}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!isDisabled}
      />

      <Button
        title={submitting ? "Saving..." : "Set Password"}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isDisabled}
      />
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
});
