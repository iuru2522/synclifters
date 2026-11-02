import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SportsExperienceForm } from "@/components/auth/sports-experience-form";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import type { SportsExperience } from "@/features/onboarding/types";
import { useGuardedAsyncAction } from "@/features/onboarding/use-guarded-async-action";

export default function SportsExperienceScreen() {
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
      } finally {
        setSaving(false);
      }
    });
  }, [experience, finishOnboarding, runOnce]);

  return (
    <AuthConfiguredGate>
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
    </AuthConfiguredGate>
  );
}
