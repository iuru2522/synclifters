import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { GenderForm, type Gender } from "@/components/auth/gender-form";
import { useAuth } from "@/features/auth/auth-context";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useGuardedAsyncAction } from "@/features/onboarding/use-guarded-async-action";

export default function GenderScreen() {
  const { isConfigured } = useAuth();
  const { saveGender } = useOnboarding();
  const runOnce = useGuardedAsyncAction();
  const [gender, setGender] = useState<Gender | null>(null);
  const [saving, setSaving] = useState(false);

  const handleGenderChange = useCallback(
    (value: Gender) => {
      void runOnce(async () => {
        setGender(value);
        setSaving(true);

        try {
          await saveGender(value);
          router.push("/weight");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to save gender.";
          Alert.alert("Could not continue", message);
          setSaving(false);
        }
      });
    },
    [runOnce, saveGender],
  );

  const handleSkip = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        await saveGender(null);
        router.push("/weight");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to continue.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [runOnce, saveGender]);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      swipeBack={{ href: "/sign-up" }}
      footer={
        <AuthFormFooter
          showNext={false}
          skipHref="/weight"
          onSkipPress={handleSkip}
          skipDisabled={saving}
          onNext={() => {}}
        />
      }
    >
      <GenderForm gender={gender} onGenderChange={handleGenderChange} disabled={saving} />
    </AuthScreenLayout>
  );
}
