import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { useAuth } from "@/features/auth/auth-context";

export default function NewPasswordScreen() {
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
      <View style={{ width: "100%", maxWidth: 360, gap: 12 }}>
        <NewPasswordForm
          oobCode={oobCode}
          disabled={submitting}
          onSubmittingChange={setSubmitting}
        />
      </View>
    </AuthScreenLayout>
  );
}
