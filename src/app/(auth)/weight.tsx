import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { WeightForm } from "@/components/auth/weight-form";
import { useAuth } from "@/features/auth/auth-context";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useGuardedAsyncAction } from "@/features/onboarding/use-guarded-async-action";

export default function WeightScreen() {
  const { isConfigured } = useAuth();
  const { saveWeight } = useOnboarding();
  const runOnce = useGuardedAsyncAction();
  const [saving, setSaving] = useState(false);

  const handleNext = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        await saveWeight();
        router.push("/age");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save weight.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [runOnce, saveWeight]);

  const handleSkip = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        await saveWeight();
        router.push("/age");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to continue.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [runOnce, saveWeight]);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      swipeBack={{ href: "/gender" }}
      footer={
        <AuthFormFooter
          onNext={handleNext}
          onSkipPress={handleSkip}
          skipDisabled={saving}
          nextDisabled={saving}
        />
      }
    >
      <WeightForm />
    </AuthScreenLayout>
  );
}
