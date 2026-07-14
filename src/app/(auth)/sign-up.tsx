import { useState } from "react";
import { View } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { useAuth } from "@/features/auth/auth-context";
import { isUserRole, type UserRole } from "@/features/users/user-profile";

export default function SignUpScreen() {
  const { isConfigured } = useAuth();
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const [submitting, setSubmitting] = useState(false);

  const role: UserRole | null = isUserRole(roleParam) ? roleParam : null;

  if (!role) {
    return <Redirect href="/sign-up-role" />;
  }

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
        <SignUpForm role={role} disabled={submitting} onSubmittingChange={setSubmitting} />
      </View>
    </AuthScreenLayout>
  );
}
