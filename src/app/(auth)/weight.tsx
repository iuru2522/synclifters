import { router } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { WeightForm } from "@/components/auth/weight-form";
import { useAuth } from "@/features/auth/auth-context";

export default function WeightScreen() {
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
      swipeBack={{ href: "/gender" }}
      footer={<AuthFormFooter onNext={() => router.push("/age")} />}
    >
      <WeightForm />
    </AuthScreenLayout>
  );
}
