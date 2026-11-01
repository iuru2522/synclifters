import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SuccessScreen } from "@/components/auth/success-screen";

export default function SuccessRoute() {
  return (
    <AuthConfiguredGate>
      <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
        <SuccessScreen />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
