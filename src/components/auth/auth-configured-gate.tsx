import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { AuthScreenLayout } from "./auth-screen-layout";
import { FirebaseSetupCard } from "./firebase-setup-card";

type AuthConfiguredGateProps = {
  children: ReactNode;
};

export function AuthConfiguredGate({ children }: AuthConfiguredGateProps) {
  const { isConfigured } = useAuth();

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return children;
}
