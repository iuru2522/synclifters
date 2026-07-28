import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { VerifyEmailScreen } from "@/components/auth/verify-email-screen";
import { useAuth } from "@/features/auth/auth-context";

export default function VerifyEmailRoute() {
  const { isConfigured } = useAuth();
  const params = useLocalSearchParams<{ oobCode?: string | string[]; code?: string | string[] }>();
  const [submitting, setSubmitting] = useState(false);

  const rawCode = params.oobCode ?? params.code;
  const oobCode = Array.isArray(rawCode) ? rawCode[0] : rawCode;

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout>
      <VerifyEmailScreen
        oobCode={oobCode}
        disabled={submitting}
        onSubmittingChange={setSubmitting}
      />
    </AuthScreenLayout>
  );
}
