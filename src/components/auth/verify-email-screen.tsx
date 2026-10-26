import { useEffect, useRef, useState } from "react";
import { Alert, AppState, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/app-button";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { colors, globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

type VerifyEmailScreenProps = {
  verificationCode?: string;
  disabled?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function VerifyEmailScreen({
  verificationCode = "",
  disabled = false,
  onSubmittingChange,
}: VerifyEmailScreenProps) {
  const {
    user,
    isAuthLoading,
    confirmEmailVerification,
    refreshUser,
    resendEmailVerification,
    signOut,
  } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const appliedVerificationCodeRef = useRef<string | null>(null);

  const email = user?.email?.trim() || "your email";
  const trimmedVerificationCode = verificationCode.trim();

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
    if (
      !trimmedVerificationCode ||
      appliedVerificationCodeRef.current === trimmedVerificationCode
    ) {
      return;
    }

    appliedVerificationCodeRef.current = trimmedVerificationCode;

    void (async () => {
      setSubmitting(true);
      onSubmittingChange?.(true);

      try {
        await confirmEmailVerification(trimmedVerificationCode);
      } catch (error) {
        appliedVerificationCodeRef.current = null;
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
  }, [trimmedVerificationCode, confirmEmailVerification, onSubmittingChange]);

  useEffect(() => {
    if (isAuthLoading || trimmedVerificationCode) {
      return;
    }

    if (!user) {
      router.replace("/sign-in");
    }
  }, [trimmedVerificationCode, isAuthLoading, user]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refreshUser().catch(() => {});
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshUser]);

  async function handleResend() {
    if (!user) {
      router.replace("/sign-in");
      return;
    }

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
    if (!user) {
      router.replace("/sign-in");
      return;
    }

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

  async function handleBack() {
    if (submitting) {
      return;
    }

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

  const isDisabled = disabled || submitting || !user;

  return (
    <View style={globalStyles.verifyEmailScreen}>
      <View style={globalStyles.verifyEmailHeader}>
        <AuthBackButton
          href="/sign-in"
          title="Verify Email"
          gap={spacing.authBackTitleVerifyEmail}
          onPress={() => {
            void handleBack();
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
