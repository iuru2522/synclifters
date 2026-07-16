import { router } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { HeightForm } from "@/components/auth/height-form";
import { useAuth } from "@/features/auth/auth-context";

export default function HeightScreen() {
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
      scrollable={false}
      swipeBack={{ href: "/age" }}
      footer={<AuthFormFooter onNext={() => router.push("/sports-experience")} />}
    >
      <HeightForm />
    </AuthScreenLayout>
  );
}
