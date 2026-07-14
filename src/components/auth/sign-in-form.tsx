import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

type SignInFormProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function SignInForm({ disabled = false, onSubmittingChange }: SignInFormProps) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <View style={globalStyles.card}>
      <AuthBackButton href="/sign-up-role" />

      <View>
        <Text style={globalStyles.heroTitle}>Welcome Back</Text>
        <Text style={globalStyles.heroSubtitle}>
          Log In to <Text style={globalStyles.brandAccent}>SL</Text> Account
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

      <View style={globalStyles.field}>
        <Text style={globalStyles.label}>Password</Text>
        <View>
          <TextInput
            style={[globalStyles.input, globalStyles.inputWithIcon]}
            placeholder="Enter Your Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!showPassword}
            autoComplete="password"
            textContentType="password"
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

      <Link href="/forgot-password" asChild>
        <Pressable disabled={isDisabled}>
          <Text style={globalStyles.forgotLink}>Forgot Password</Text>
        </Pressable>
      </Link>

      <Pressable
        style={[globalStyles.primaryButton, isDisabled ? globalStyles.primaryButtonDisabled : null]}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel="Log In"
      >
        <Text style={globalStyles.primaryButtonText}>
          {submitting ? "Working..." : "Log In"}
        </Text>
      </Pressable>

      <View style={globalStyles.promptRow}>
        <Text style={globalStyles.promptText}>Don't Have an Account? </Text>
        <Link href="/sign-up-role" asChild>
          <Pressable disabled={isDisabled} accessibilityRole="link" accessibilityLabel="Sign Up">
            <Text style={globalStyles.promptLink}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
