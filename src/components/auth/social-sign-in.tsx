import * as AppleAuthentication from "expo-apple-authentication";
import { useState } from "react";
import { Alert, Button, View } from "react-native";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { globalStyles, layout } from "@/styles/global";
import { AuthCard } from "./auth-card";

type SocialSignInProps = {
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function SocialSignIn({ disabled = false, onSubmittingChange }: SocialSignInProps) {
  const { signInWithGoogle, signInWithApple, isAppleSignInAvailable } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const isDisabled = disabled || submitting;
  const googleEnabled = Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);

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

  async function handleAppleSignIn() {
    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      await signInWithApple();
    } catch (error) {
      if (error instanceof AuthServiceError && error.cancelled) {
        return;
      }

      const message =
        error instanceof AuthServiceError ? error.message : "Apple sign-in failed.";

      Alert.alert("Sign-in failed", message);
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  return (
    <AuthCard>
      <Button
        title={submitting ? "Signing in..." : "Continue with Google"}
        onPress={() => {
          void handleGoogleSignIn();
        }}
        disabled={isDisabled || !googleEnabled}
      />

      {isAppleSignInAvailable ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={layout.appleButtonRadius}
          style={[globalStyles.appleButton, isDisabled ? globalStyles.appleButtonDisabled : null]}
          onPress={() => {
            if (isDisabled) {
              return;
            }

            void handleAppleSignIn();
          }}
        />
      ) : null}
    </AuthCard>
  );
}

export function SocialSignInDivider() {
  return <View style={globalStyles.divider} />;
}
