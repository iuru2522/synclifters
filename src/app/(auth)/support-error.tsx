import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { SupportErrorScreen } from "@/components/auth/support-error-screen";
import { useAuth } from "@/features/auth/auth-context";

export default function SupportErrorRoute() {
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
      <SupportErrorScreen />
    </AuthScreenLayout>
  );
}
