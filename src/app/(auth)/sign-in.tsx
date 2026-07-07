import { useState } from "react";
import { View } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SocialSignIn, SocialSignInDivider } from "@/components/auth/social-sign-in";
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
    <AuthScreenLayout>
      <View style={{ width: "100%", maxWidth: 360, gap: 12 }}>
        <SignInForm disabled={submitting} onSubmittingChange={setSubmitting} />
        <SocialSignInDivider />
        <SocialSignIn disabled={submitting} onSubmittingChange={setSubmitting} />
      </View>
    </AuthScreenLayout>
  );
}
