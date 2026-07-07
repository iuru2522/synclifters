import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/features/auth/auth-context";

export default function AuthLayout() {
  const { user, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isConfigured && user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
