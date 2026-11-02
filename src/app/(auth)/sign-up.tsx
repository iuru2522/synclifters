import { useState } from "react";
import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpScreen() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthConfiguredGate>
      <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
        <SignUpForm disabled={submitting} onSubmittingChange={setSubmitting} />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
