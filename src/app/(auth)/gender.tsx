import { router } from "expo-router";
import { useCallback, useState } from "react";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { GenderForm, type Gender } from "@/components/auth/gender-form";
import { useAuth } from "@/features/auth/auth-context";

export default function GenderScreen() {
  const { isConfigured } = useAuth();
  const [gender, setGender] = useState<Gender | null>(null);

  const handleGenderChange = useCallback((value: Gender) => {
    setGender(value);
    router.push("/weight");
  }, []);

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
      footer={<AuthFormFooter showNext={false} onNext={() => router.push("/weight")} />}
    >
      <GenderForm gender={gender} onGenderChange={handleGenderChange} />
    </AuthScreenLayout>
  );
}
