import { useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError, type AuthMode } from "@/features/auth/auth-service";
import { AuthCard, authCardStyles } from "./auth-card";

type SignInFormProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function SignInForm({ disabled = false, onSubmittingChange }: SignInFormProps) {
  const { signInWithEmail } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await signInWithEmail(email, password, mode);
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
      <Text style={authCardStyles.title}>{mode === "signin" ? "Sign in" : "Create account"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!isDisabled}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isDisabled}
      />

      <Button
        title={submitting ? "Working..." : mode === "signin" ? "Sign in" : "Register"}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isDisabled}
      />

      <Pressable
        disabled={isDisabled}
        onPress={() => setMode(mode === "signin" ? "register" : "signin")}
      >
        <Text style={styles.switchText}>
          {mode === "signin" ? "Need an account? Register" : "Already have an account? Sign in"}
        </Text>
      </Pressable>
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
  switchText: {
    color: "#2563eb",
    textAlign: "center",
  },
});
