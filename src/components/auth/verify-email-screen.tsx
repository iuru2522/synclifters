import { useEffect, useRef, useState } from "react";
import { Alert, AppState, Text, View } from "react-native";
import { AppButton } from "@/components/app-button";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

type VerifyEmailScreenProps = {
  oobCode?: string;
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function VerifyEmailScreen({
  oobCode = "",
  disabled = false,
  onSubmittingChange,
}: VerifyEmailScreenProps) {
  const {
    user,
    confirmEmailVerification,
    refreshUser,
    resendEmailVerification,
    signOut,
  } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const appliedCodeRef = useRef<string | null>(null);

  const email = user?.email?.trim() || "your email";

  async function withSubmitting<T>(action: () => Promise<T>): Promise<T> {
    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      return await action();
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  useEffect(() => {
    const code = oobCode.trim();

    if (!code || appliedCodeRef.current === code) {
      return;
    }

    appliedCodeRef.current = code;

    void (async () => {
      setSubmitting(true);
      onSubmittingChange?.(true);

      try {
        await confirmEmailVerification(code);
      } catch (error) {
        appliedCodeRef.current = null;
        const message =
          error instanceof AuthServiceError
            ? error.message
            : "Failed to verify email.";
        Alert.alert("Verification failed", message);
      } finally {
        setSubmitting(false);
        onSubmittingChange?.(false);
      }
    })();
  }, [oobCode, confirmEmailVerification, onSubmittingChange]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refreshUser().catch(() => {
          // Ignore refresh errors while returning from the email client.
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshUser]);

  async function handleResend() {
    try {
      await withSubmitting(async () => {
        await resendEmailVerification();
      });
      Alert.alert("Check your email", `A new verification link was sent to ${email}.`);
    } catch (error) {
      const message =
        error instanceof AuthServiceError
          ? error.message
          : "Failed to send verification email.";
      Alert.alert("Resend failed", message);
    }
  }

  async function handleCheckVerified() {
    try {
      const nextUser = await withSubmitting(async () => refreshUser());
      if (!nextUser?.emailVerified) {
        Alert.alert(
          "Not verified yet",
          "Open the link in your email, then tap I've Verified again.",
        );
      }
    } catch (error) {
      const message =
        error instanceof AuthServiceError
          ? error.message
          : "Could not refresh verification status.";
      Alert.alert("Check failed", message);
    }
  }

  async function handleSignOut() {
    try {
      await withSubmitting(async () => {
        await signOut();
      });
    } catch (error) {
      const message =
        error instanceof AuthServiceError ? error.message : "Sign out failed.";
      Alert.alert("Sign out failed", message);
    }
  }

  const isDisabled = disabled || submitting;

  return (
    <View style={globalStyles.verifyEmailScreen}>
      <View style={globalStyles.verifyEmailHeader}>
        <AuthBackButton
          href="/sign-in"
          title="Verify Email"
          gap={spacing.authBackTitleVerifyEmail}
          onPress={() => {
            void handleSignOut();
          }}
        />

        <View style={globalStyles.authInputsCardShadow}>
          <View style={[globalStyles.signUpInputsCard, globalStyles.verifyEmailCard]}>
            <Text style={globalStyles.verifyEmailMessage}>
              We sent a verification link to{"\n"}
              <Text style={globalStyles.verifyEmailAddress}>{email}</Text>
            </Text>
            <Text style={globalStyles.verifyEmailHint}>
              Open the link in that email, then come back and tap I've Verified.
            </Text>
          </View>
        </View>
      </View>

      <View style={globalStyles.verifyEmailFormContent}>
        <AppButton
          title={submitting ? "Checking..." : "I've Verified"}
          onPress={() => {
            void handleCheckVerified();
          }}
          disabled={isDisabled}
          pressFillColor={colors.backArrow}
          pressLabelColor={colors.inputText}
        />

        <AppButton
          title={submitting ? "Sending..." : "Resend Email"}
          onPress={() => {
            void handleResend();
          }}
          disabled={isDisabled}
          borderColor={colors.resetButtonBorder}
          pressFillColor={colors.resetButtonBorder}
          pressLabelColor={colors.inputText}
        />
      </View>
    </View>
  );
}
