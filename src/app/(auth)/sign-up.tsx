import { useState } from "react";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { useAuth } from "@/features/auth/auth-context";

export default function SignUpScreen() {
  const { isConfigured } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout swipeBack={{ href: "/sign-in" }}>
      <SignUpForm disabled={submitting} onSubmittingChange={setSubmitting} />
    </AuthScreenLayout>
  );
}
