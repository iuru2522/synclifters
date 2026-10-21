import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { GenderForm, type Gender } from "@/components/auth/gender-form";
import { useAuthBack } from "@/components/auth/use-auth-back";
import { useAuth } from "@/features/auth/auth-context";
import { AuthServiceError } from "@/features/auth/auth-service";
import { useOnboarding } from "@/features/onboarding/onboarding-context";
import { useGuardedAsyncAction } from "@/features/onboarding/use-guarded-async-action";

export default function GenderScreen() {
  const { isConfigured, user, signOut } = useAuth();
  const { gender, setGender, saveGender } = useOnboarding();
  const runOnce = useGuardedAsyncAction();
  const navigateBackToSignUp = useAuthBack({ href: "/sign-up" });
  const [saving, setSaving] = useState(false);

  const handleGenderChange = useCallback(
    (value: Gender) => {
      void runOnce(async () => {
        const previousGender = gender;
        setGender(value);
        setSaving(true);

        try {
          await saveGender(value);
          router.push("/weight");
        } catch (error) {
          setGender(previousGender);
          const message = error instanceof Error ? error.message : "Failed to save gender.";
          Alert.alert("Could not continue", message);
        } finally {
          setSaving(false);
        }
      });
    },
    [gender, runOnce, saveGender, setGender],
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
      } finally {
        setSaving(false);
      }
    });
  }, [runOnce, saveGender]);

  const handleBack = useCallback(() => {
    void runOnce(async () => {
      setSaving(true);

      try {
        if (user) {
          await signOut();
        }

        navigateBackToSignUp();
      } catch (error) {
        const message =
          error instanceof AuthServiceError ? error.message : "Could not go back.";
        Alert.alert("Sign out failed", message);
      } finally {
        setSaving(false);
      }
    });
  }, [navigateBackToSignUp, runOnce, signOut, user]);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      swipeBack={{ href: "/sign-up", onBack: handleBack }}
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
      <GenderForm
        gender={gender}
        onGenderChange={handleGenderChange}
        onBackPress={handleBack}
        disabled={saving}
      />
    </AuthScreenLayout>
  );
}
