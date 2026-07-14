import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput } from "react-native";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { AuthCard, authCardStyles } from "./auth-card";

type SignInFormProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function SignInForm({ disabled = false, onSubmittingChange }: SignInFormProps) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await signInWithEmail(email, password, "signin");
    } catch (error) {
      const message =
        error instanceof AuthServiceError ? error.message : "Authentication failed.";

      Alert.alert("Auth failed", message);
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  const isDisabled = disabled || submitting;

  return (
    <AuthCard>
      <Text style={authCardStyles.title}>Log In</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
        editable={!isDisabled}
      />

      <Button
        title={submitting ? "Working..." : "Log In"}
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
