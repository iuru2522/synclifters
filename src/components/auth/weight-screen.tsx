import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { WeightForm } from "@/components/auth/weight-form";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useOnboardingStep } from "@/features/onboarding/use-onboarding-step";

export default function WeightScreen() {
  const { saveWeight } = useOnboarding();
  const { saving, handleNext, handleSkip } = useOnboardingStep({
    save: saveWeight,
    nextHref: "/age",
    saveErrorMessage: "Failed to save weight.",
  });

  return (
    <AuthConfiguredGate>
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
    </AuthConfiguredGate>
  );
}
