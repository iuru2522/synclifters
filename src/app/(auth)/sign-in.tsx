import { useState } from "react";
import { AuthConfiguredGate } from "@/components/auth/auth-configured-gate";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInScreen() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthConfiguredGate>
      <AuthScreenLayout swipeBack={{ href: "/sign-up" }} videoBackground>
        <SignInForm disabled={submitting} onSubmittingChange={setSubmitting} />
      </AuthScreenLayout>
    </AuthConfiguredGate>
  );
}
