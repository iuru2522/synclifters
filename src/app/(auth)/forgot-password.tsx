import { useState } from "react";
import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordScreen() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthConfiguredGate>
      <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
        <ForgotPasswordForm disabled={submitting} onSubmittingChange={setSubmitting} />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
