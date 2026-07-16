import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { SuccessScreen } from "@/components/auth/success-screen";
import { useAuth } from "@/features/auth/auth-context";

export default function SuccessRoute() {
  const { isConfigured } = useAuth();

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
      <SuccessScreen />
    </AuthScreenLayout>
  );
}
