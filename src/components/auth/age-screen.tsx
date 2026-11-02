import { AgeForm } from "@/components/auth/age-form";
import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useOnboardingStep } from "@/features/onboarding/use-onboarding-step";

export default function AgeScreen() {
  const { saveAge } = useOnboarding();
  const { saving, handleNext, handleSkip } = useOnboardingStep({
    save: saveAge,
    nextHref: "/height",
    saveErrorMessage: "Failed to save age.",
  });

  return (
    <AuthConfiguredGate>
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
    </AuthConfiguredGate>
  );
}
