import { useState } from "react";
import { View } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { useAuth } from "@/features/auth/auth-context";

export default function ForgotPasswordScreen() {
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
        <ForgotPasswordForm disabled={submitting} onSubmittingChange={setSubmitting} />
      </View>
    </AuthScreenLayout>
  );
}
