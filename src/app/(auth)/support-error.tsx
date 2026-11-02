import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SupportErrorScreen } from "@/components/auth/support-error-screen";

export default function SupportErrorRoute() {
  return (
    <AuthConfiguredGate>
      <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
        <SupportErrorScreen />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
