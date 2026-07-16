import { useState } from "react";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { useAuth } from "@/features/auth/auth-context";

export default function SignInScreen() {
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
    <AuthScreenLayout swipeBack={{ href: "/sign-up" }} videoBackground>
      <SignInForm disabled={submitting} onSubmittingChange={setSubmitting} />
    </AuthScreenLayout>
  );
}
