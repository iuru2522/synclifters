import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { ErrorScreen } from "@/components/auth/error-screen";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { useAuth } from "@/features/auth/auth-context";

export default function ErrorRoute() {
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
      <ErrorScreen />
    </AuthScreenLayout>
  );
}
