import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SupportSubmittedScreen } from "@/components/auth/support-submitted-screen";

export default function SupportSubmittedRoute() {
  return (
    <AuthConfiguredGate>
      <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
        <SupportSubmittedScreen />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
