import { useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import type { UserRole } from "@/features/users/user-profile";
import { AuthCard, authCardStyles } from "./auth-card";

type SignUpFormProps = {
  role: UserRole;
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function SignUpForm({ role, disabled = false, onSubmittingChange }: SignUpFormProps) {
  const { signInWithEmail } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await signInWithEmail(email, password, "register", {
        role,
        firstName,
        lastName,
        displayName: [firstName, lastName].filter(Boolean).join(" ").trim(),
      });
    } catch (error) {
      const message =
        error instanceof AuthServiceError ? error.message : "Sign up failed.";

      Alert.alert("Sign up failed", message);
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  const isDisabled = disabled || submitting;
  const roleLabel = role === "coach" ? "Coach" : "Athlete";

  return (
    <AuthCard>
      <Text style={authCardStyles.title}>Sign up</Text>
      <Text style={authCardStyles.description}>Creating a {roleLabel} account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        autoCapitalize="words"
        autoComplete="given-name"
        textContentType="givenName"
        value={firstName}
        onChangeText={setFirstName}
        editable={!isDisabled}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        autoCapitalize="words"
        autoComplete="family-name"
        textContentType="familyName"
        value={lastName}
        onChangeText={setLastName}
        editable={!isDisabled}
      />
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
        autoComplete="new-password"
        textContentType="newPassword"
        value={password}
        onChangeText={setPassword}
        editable={!isDisabled}
      />

      <Button
        title={submitting ? "Working..." : "Sign Up"}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isDisabled}
      />

      <Link href="/sign-in" asChild>
        <Pressable disabled={isDisabled}>
          <Text style={styles.switchText}>Already have an account? Sign in</Text>
        </Pressable>
      </Link>
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
