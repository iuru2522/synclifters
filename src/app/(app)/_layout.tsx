import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/features/auth/auth-context";

export default function AppLayout() {
  const { user, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isConfigured || !user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
