import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { VerifyEmailScreen } from "@/components/auth/verify-email-screen";

export default function VerifyEmailRoute() {
  const params = useLocalSearchParams<{ oobCode?: string | string[]; code?: string | string[] }>();
  const [submitting, setSubmitting] = useState(false);

  const rawCode = params.oobCode ?? params.code;
  const verificationCode = Array.isArray(rawCode) ? rawCode[0] : rawCode;

  return (
    <AuthConfiguredGate>
      <AuthScreenLayout>
        <VerifyEmailScreen
          verificationCode={verificationCode}
          disabled={submitting}
          onSubmittingChange={setSubmitting}
        />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
