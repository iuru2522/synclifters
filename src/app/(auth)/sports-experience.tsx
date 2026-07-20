import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import {
  SportsExperienceForm,
  type SportsExperience,
} from "@/components/auth/sports-experience-form";
import { useAuth } from "@/features/auth/auth-context";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useGuardedAsyncAction } from "@/features/onboarding/use-guarded-async-action";

export default function SportsExperienceScreen() {
  const { isConfigured } = useAuth();
  const { finishOnboarding } = useOnboarding();
  const runOnce = useGuardedAsyncAction();
  const [experience, setExperience] = useState<SportsExperience | null>(null);
  const [saving, setSaving] = useState(false);

  const handleDone = useCallback(() => {
    if (!experience) {
      return;
    }

    void runOnce(async () => {
      setSaving(true);

      try {
        await finishOnboarding(experience);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to complete onboarding.";
        Alert.alert("Could not continue", message);
        setSaving(false);
      }
    });
  }, [experience, finishOnboarding, runOnce]);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      swipeBack={{ href: "/height" }}
      footer={
        <AuthFormFooter
          nextTitle="Done"
          onNext={handleDone}
          nextDisabled={experience === null || saving}
          showSkip={false}
        />
      }
    >
      <SportsExperienceForm experience={experience} onExperienceChange={setExperience} />
    </AuthScreenLayout>
  );
}
