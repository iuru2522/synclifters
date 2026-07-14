import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles } from "@/styles/global";

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
  const [showPassword, setShowPassword] = useState(false);
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
    <View style={globalStyles.card}>
      <View>
        <Text style={globalStyles.heroTitle}>New Password</Text>
        <Text style={globalStyles.heroSubtitle}>
          Set a new <Text style={globalStyles.brandAccent}>SL</Text> password
        </Text>
      </View>

      <View style={globalStyles.field}>
        <Text style={globalStyles.label}>New Password</Text>
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

      <View style={globalStyles.field}>
        <Text style={globalStyles.label}>Confirm Password</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Confirm Your Password"
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!showPassword}
          autoComplete="new-password"
          textContentType="newPassword"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
        accessibilityLabel="Set Password"
      >
        <Text style={globalStyles.primaryButtonText}>
          {submitting ? "Saving..." : "Set Password"}
        </Text>
      </Pressable>
    </View>
  );
}
