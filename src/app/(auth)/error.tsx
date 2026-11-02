import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { ErrorScreen } from "@/components/auth/error-screen";

export default function ErrorRoute() {
  return (
    <AuthConfiguredGate>
      <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
        <ErrorScreen />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
