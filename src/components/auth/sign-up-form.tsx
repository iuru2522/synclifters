import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import type { UserRole } from "@/features/users/user-profile";
import { colors, globalStyles } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

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
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!agreedToTerms) {
      Alert.alert(
        "Terms required",
        "Please agree to the SyncLifters Terms & Conditions before signing up.",
      );
      return;
    }

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

  return (
    <View style={globalStyles.card}>
      <AuthBackButton href="/sign-up-role" />

      <View>
        <Text style={globalStyles.heroTitle}>Let's Get You Started</Text>
        <Text style={globalStyles.createAccountSubtitle}>
          Create <Text style={globalStyles.brandAccent}>SL</Text> account
        </Text>
      </View>


      <View style={globalStyles.fieldRow}>
        <View style={[globalStyles.field, globalStyles.fieldHalf]}>
          <Text style={globalStyles.label}>First Name</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Ryan"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            value={firstName}
            onChangeText={setFirstName}
            editable={!isDisabled}
          />
        </View>
        <View style={[globalStyles.field, globalStyles.fieldHalf]}>
          <Text style={globalStyles.label}>Last Name</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Gosling"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            value={lastName}
            onChangeText={setLastName}
            editable={!isDisabled}
          />
        </View>
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

      <View style={globalStyles.field}>
        <Text style={globalStyles.label}>Password</Text>
        <View>
          <TextInput
            style={[globalStyles.input, globalStyles.inputWithIcon]}
            placeholder="Enter Your Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            value={password}
            onChangeText={setPassword}
            editable={!isDisabled}
          />
          <Pressable
            style={globalStyles.inputIconButton}
            onPress={() => setShowPassword((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <SymbolView
              name={{
                ios: showPassword ? "eye.slash" : "eye",
                android: showPassword ? "visibility_off" : "visibility",
                web: showPassword ? "visibility_off" : "visibility",
              }}
              size={20}
              tintColor={colors.text}
              fallback={<Text style={{ color: colors.text }}>{showPassword ? "Hide" : "Show"}</Text>}
            />
          </Pressable>
        </View>
      </View>

      <Pressable
        style={globalStyles.checkboxRow}
        onPress={() => setAgreedToTerms((current) => !current)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreedToTerms }}
        accessibilityLabel="Agree to the SyncLifters Terms and Conditions"
      >
        <View style={[globalStyles.checkbox, agreedToTerms ? globalStyles.checkboxChecked : null]}>
          {agreedToTerms ? <Text style={globalStyles.checkmark}>✓</Text> : null}
        </View>
        <Text style={globalStyles.checkboxLabel}>
          Agree to the SyncLifters{" "}
          <Text style={globalStyles.termsLink}>Terms & Conditions</Text>
        </Text>
      </Pressable>

      <Pressable
        style={globalStyles.checkboxRow}
        onPress={() => setMarketingOptIn((current) => !current)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: marketingOptIn }}
        accessibilityLabel="Sign up to SyncLifters marketing emails"
      >
        <View style={[globalStyles.checkbox, marketingOptIn ? globalStyles.checkboxChecked : null]}>
          {marketingOptIn ? <Text style={globalStyles.checkmark}>✓</Text> : null}
        </View>
        <Text style={globalStyles.checkboxLabel}>
          Sign Up to SyncLigters marketing emails, exclusive offers, news, and more.
        </Text>
      </Pressable>

      <Pressable
        style={[globalStyles.primaryButton, isDisabled ? globalStyles.primaryButtonDisabled : null]}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel="Sign Up"
      >
        <Text style={globalStyles.primaryButtonText}>
          {submitting ? "Working..." : "Sign Up"}
        </Text>
      </Pressable>

      <View style={globalStyles.promptRow}>
        <Text style={globalStyles.promptText}>Already Have an Account? </Text>
        <Link href="/sign-in" asChild>
          <Pressable disabled={isDisabled} accessibilityRole="link" accessibilityLabel="Log In">
            <Text style={globalStyles.promptLink}>Log In</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
