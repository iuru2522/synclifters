import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { AgeForm } from "@/components/auth/age-form";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { useAuth } from "@/features/auth/auth-context";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useGuardedAsyncAction } from "@/features/onboarding/use-guarded-async-action";

export default function AgeScreen() {
  const { isConfigured } = useAuth();
  const { saveAge } = useOnboarding();
  const runOnce = useGuardedAsyncAction();
  const [saving, setSaving] = useState(false);

  const handleNext = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        await saveAge();
        router.push("/height");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save age.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [runOnce, saveAge]);

  const handleSkip = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        await saveAge();
        router.push("/height");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to continue.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [runOnce, saveAge]);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      swipeBack={{ href: "/weight" }}
      footer={
        <AuthFormFooter
          onNext={handleNext}
          onSkipPress={handleSkip}
          skipDisabled={saving}
          nextDisabled={saving}
        />
      }
    >
      <AgeForm />
    </AuthScreenLayout>
  );
}
