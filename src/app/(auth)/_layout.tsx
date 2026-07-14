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
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="start" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="new-password" />
      <Stack.Screen name="sign-up-role" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="contact-us" />
    </Stack>
  );
}
