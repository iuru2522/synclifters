import { AppButton } from "@/components/app-button";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles } from "@/styles/global";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { AuthBackButton } from "./auth-back-button";

const googleIcon = require("../../../assets/images/google-icon.png");

type SignUpFormProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignUpField = "fullName" | "email" | "password";

function isValidPassword(value: string) {
  return (
    value.length >= 8 &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export function SignUpForm({ disabled = false, onSubmittingChange }: SignUpFormProps) {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [focusedField, setFocusedField] = useState<SignUpField | null>(null);

  const fullNameInvalid = fullName.trim().length === 0;
  const trimmedEmail = email.trim();
  const emailFormatInvalid = trimmedEmail.length > 0 && !EMAIL_PATTERN.test(trimmedEmail);
  const emailEmpty = trimmedEmail.length === 0;
  const emailInvalid = emailEmpty || !EMAIL_PATTERN.test(trimmedEmail);
  const showEmailError = emailFormatInvalid || (showFieldErrors && emailEmpty);
  const passwordInvalid = !isValidPassword(password);
  const isDisabled = disabled || submitting;
  const googleEnabled = Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);

  function getInputBorderStyle(field: SignUpField, showError: boolean) {
    if (showError) {
      return globalStyles.authInputError;
    }

    if (focusedField === field) {
      return globalStyles.authInputFocused;
    }

    return null;
  }

  async function handleSubmit() {
    setShowFieldErrors(true);

    if (fullNameInvalid || emailInvalid || passwordInvalid) {
      return;
    }

    const trimmedName = fullName.trim();
    const [firstName = "", ...lastNameParts] = trimmedName.split(/\s+/);
    const lastName = lastNameParts.join(" ");

    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await signInWithEmail(email, password, "register", {
        firstName,
        lastName,
        displayName: trimmedName,
      });
      router.replace("/gender");
    } catch (error) {
      const message =
        error instanceof AuthServiceError ? error.message : "Sign up failed.";

      Alert.alert("Sign up failed", message);
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

  return (
    <View style={globalStyles.signUpScreen}>
      <View style={globalStyles.signUpHeader}>
        <AuthBackButton href="/sign-in" />

        <View style={globalStyles.authInputsCardShadow}>
          <View style={globalStyles.signUpInputsCard}>
          <View style={globalStyles.signUpCardFields}>
            <View style={globalStyles.signUpInputGroup}>
              <View style={globalStyles.authFormField}>
                <Text style={globalStyles.signUpInputLabel}>Full Name</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  globalStyles.signUpInput,
                  getInputBorderStyle("fullName", showFieldErrors && fullNameInvalid),
                ]}
                placeholder="full name"
                placeholderTextColor={colors.inputPlaceholder}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => {
                  setFocusedField("fullName");
                }}
                onBlur={() => {
                  setFocusedField((current) => (current === "fullName" ? null : current));
                }}
                editable={!isDisabled}
                accessibilityLabel="Full Name"
              />
            </View>

            <View style={globalStyles.authFormField}>
              <Text style={globalStyles.signUpInputLabel}>Email</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  globalStyles.signUpInput,
                  getInputBorderStyle("email", showEmailError),
                ]}
                placeholder="enter email"
                placeholderTextColor={colors.inputPlaceholder}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                onFocus={() => {
                  setFocusedField("email");
                }}
                onBlur={() => {
                  setFocusedField((current) => (current === "email" ? null : current));
                }}
                editable={!isDisabled}
                accessibilityLabel="Email"
              />
            </View>

            <View style={globalStyles.authFormField}>
              <Text style={globalStyles.signUpInputLabel}>Password</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  globalStyles.signUpInput,
                  getInputBorderStyle("password", showFieldErrors && passwordInvalid),
                ]}
                placeholder="************"
                placeholderTextColor={colors.inputPlaceholder}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
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
            </View>
            </View>

            <View style={globalStyles.signUpSocialGroup}>
              <Text style={globalStyles.signUpOrSignWith}>or sign with</Text>

              <Pressable
                style={globalStyles.signUpGoogleButton}
                onPress={() => {
                  void handleGoogleSignIn();
                }}
                disabled={isDisabled || !googleEnabled}
                accessibilityRole="button"
                accessibilityLabel="Sign up with Google"
              >
                <Image
                  source={googleIcon}
                  style={globalStyles.signUpGoogleIcon}
                  contentFit="contain"
                />
              </Pressable>
            </View>
          </View>
        </View>
        </View>
      </View>

      <View style={globalStyles.signUpPostHeader}>
        <Text style={globalStyles.signUpLegalText}>
          By continuing, you agree to{"\n"}
          <Text style={globalStyles.signUpLegalLink}>Terms of Use</Text>
          {" and "}
          <Text style={globalStyles.signUpLegalLink}>Privacy Policy</Text>.
        </Text>

        <View style={globalStyles.signUpFormContent}>
          <AppButton
            title={submitting ? "Working..." : "Sign Up"}
            onPress={() => {
              void handleSubmit();
            }}
            disabled={isDisabled}
            pressFillColor={colors.backArrow}
            pressLabelColor={colors.inputText}
          />

        <Link href="/sign-in" asChild>
          <Pressable
            style={globalStyles.signUpLoginLink}
            disabled={isDisabled}
            accessibilityRole="link"
            accessibilityLabel="Log in"
          >
            <Text style={globalStyles.signUpLoginLinkText}>Log In</Text>
          </Pressable>
        </Link>
        </View>
      </View>
    </View>
  );
}
