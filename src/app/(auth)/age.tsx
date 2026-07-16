import { router } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { AgeForm } from "@/components/auth/age-form";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { useAuth } from "@/features/auth/auth-context";

export default function AgeScreen() {
  const { isConfigured } = useAuth();

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      swipeBack={{ href: "/weight" }}
      footer={<AuthFormFooter onNext={() => router.push("/height")} />}
    >
      <AgeForm />
    </AuthScreenLayout>
  );
}
