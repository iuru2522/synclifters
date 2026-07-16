import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { SupportSubmittedScreen } from "@/components/auth/support-submitted-screen";
import { useAuth } from "@/features/auth/auth-context";

export default function SupportSubmittedRoute() {
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
      <SupportSubmittedScreen />
    </AuthScreenLayout>
  );
}
