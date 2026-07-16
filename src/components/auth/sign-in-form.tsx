import { AppButton } from "@/components/app-button";
import { AuthBlurInputsCard } from "@/components/auth/auth-blur-inputs-card";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles } from "@/styles/global";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

const googleIcon = require("../../../assets/images/google-icon.png");

type SignInFormProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

type SignInField = "email" | "password";

export function SignInForm({ disabled = false, onSubmittingChange }: SignInFormProps) {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [focusedField, setFocusedField] = useState<SignInField | null>(null);
  const googleEnabled = Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);

  const emailInvalid = email.trim().length === 0;
  const passwordInvalid = password.length === 0;

  function getInputBorderStyle(field: SignInField, invalid: boolean) {
    if (focusedField === field) {
      return globalStyles.authInputFocused;
    }

    if (showFieldErrors && invalid) {
      return globalStyles.authInputError;
    }

    return null;
  }

  async function handleSubmit() {
    setShowFieldErrors(true);

    if (emailInvalid || passwordInvalid) {
      return;
    }

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

  async function handleGoogleSignIn() {
    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      if (error instanceof AuthServiceError && error.cancelled) {
        return;
      }

      const message =
        error instanceof AuthServiceError ? error.message : "Google sign-in failed.";

      Alert.alert("Sign-in failed", message);
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  const isDisabled = disabled || submitting;

  return (
    <View style={globalStyles.signInScreen}>
      <View style={globalStyles.signInHeader}>
        <Text style={[globalStyles.authScreenTitle, globalStyles.authScreenTitleTextCenter]}>
          Welcome
        </Text>

        <View style={[globalStyles.authBlurInputsCardWrap, globalStyles.authInputsCardShadow]}>
          <AuthBlurInputsCard>
            <View style={globalStyles.signUpInputGroup}>
              <View style={globalStyles.authFormField}>
                <Text style={globalStyles.signUpInputLabel}>Username or email</Text>
                <TextInput
                  style={[
                    globalStyles.input,
                    globalStyles.signUpInput,
                    getInputBorderStyle("email", emailInvalid),
                  ]}
                  placeholder="enter your email"
                  placeholderTextColor={colors.inputPlaceholder}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="username"
                  textContentType="username"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => {
                    setFocusedField("email");
                  }}
                  onBlur={() => {
                    setFocusedField((current) => (current === "email" ? null : current));
                  }}
                  editable={!isDisabled}
                  accessibilityLabel="Username or email"
                />
              </View>

              <View style={globalStyles.authFormField}>
                <Text style={globalStyles.signUpInputLabel}>Password</Text>
                <TextInput
                  style={[
                    globalStyles.input,
                    globalStyles.signUpInput,
                    getInputBorderStyle("password", passwordInvalid),
                  ]}
                  placeholder="************"
                  placeholderTextColor={colors.inputPlaceholder}
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => {
                    setFocusedField("password");
                  }}
                  onBlur={() => {
                    setFocusedField((current) => (current === "password" ? null : current));
                  }}
                  editable={!isDisabled}
                  accessibilityLabel="Password"
                />
                <Link href="/forgot-password" asChild>
                  <Pressable style={globalStyles.signInForgotLink} disabled={isDisabled}>
                    <Text style={globalStyles.signInForgotLinkText}>Forgot Password?</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </AuthBlurInputsCard>
        </View>
      </View>

      <View style={globalStyles.signInFormContent}>
        <AppButton
          title={submitting ? "Working..." : "Log In"}
          onPress={() => {
            void handleSubmit();
          }}
          disabled={isDisabled}
          pressFillColor={colors.backArrow}
          pressLabelColor={colors.inputText}
        />

        <View style={globalStyles.signInSocialGroup}>
          <Text style={globalStyles.signInOrSignWith}>or sign up with</Text>

          <Pressable
            style={globalStyles.signUpGoogleButton}
            onPress={() => {
              void handleGoogleSignIn();
            }}
            disabled={isDisabled || !googleEnabled}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
          >
            <Image
              source={googleIcon}
              style={globalStyles.signUpGoogleIcon}
              contentFit="contain"
            />
          </Pressable>
        </View>

        <Link href="/sign-up" asChild>
          <Pressable
            style={globalStyles.signUpLoginLink}
            disabled={isDisabled}
            accessibilityRole="link"
            accessibilityLabel="Sign Up"
          >
            <Text style={globalStyles.signUpLoginLinkText}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
