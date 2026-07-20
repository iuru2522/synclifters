import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { HeightForm } from "@/components/auth/height-form";
import { useAuth } from "@/features/auth/auth-context";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useGuardedAsyncAction } from "@/features/onboarding/use-guarded-async-action";

export default function HeightScreen() {
  const { isConfigured } = useAuth();
  const { saveHeight } = useOnboarding();
  const runOnce = useGuardedAsyncAction();
  const [saving, setSaving] = useState(false);

  const handleNext = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        await saveHeight();
        router.push("/sports-experience");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save height.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [runOnce, saveHeight]);

  const handleSkip = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        await saveHeight();
        router.push("/sports-experience");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to continue.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [runOnce, saveHeight]);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      scrollable={false}
      swipeBack={{ href: "/age" }}
      footer={
        <AuthFormFooter
          onNext={handleNext}
          onSkipPress={handleSkip}
          skipDisabled={saving}
          nextDisabled={saving}
        />
      }
    >
      <HeightForm />
    </AuthScreenLayout>
  );
}
