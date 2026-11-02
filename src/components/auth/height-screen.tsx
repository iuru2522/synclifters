import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { HeightForm } from "@/components/auth/height-form";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useOnboardingStep } from "@/features/onboarding/use-onboarding-step";

export default function HeightScreen() {
  const { saveHeight } = useOnboarding();
  const { saving, handleNext, handleSkip } = useOnboardingStep({
    save: saveHeight,
    nextHref: "/sports-experience",
    saveErrorMessage: "Failed to save height.",
  });

  return (
    <AuthConfiguredGate>
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
    </AuthConfiguredGate>
  );
}
