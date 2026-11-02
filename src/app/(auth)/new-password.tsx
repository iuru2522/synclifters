import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { NewPasswordForm } from "@/components/auth/new-password-form";

export default function NewPasswordScreen() {
  const params = useLocalSearchParams<{ oobCode?: string | string[]; code?: string | string[] }>();
  const [submitting, setSubmitting] = useState(false);

  const rawCode = params.oobCode ?? params.code;
  const oobCode = Array.isArray(rawCode) ? rawCode[0] : rawCode;

  return (
    <AuthConfiguredGate>
      <AuthScreenLayout>
        <NewPasswordForm
          oobCode={oobCode}
          disabled={submitting}
          onSubmittingChange={setSubmitting}
        />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
