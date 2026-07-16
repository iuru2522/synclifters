import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/features/auth/auth-context";
import { MeasurementUnitProvider } from "@/features/onboarding/measurement-unit-context";
import { colors } from "@/styles/global";

export default function AuthLayout() {
  const { user, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isConfigured && user) {
    return <Redirect href="/" />;
  }

  return (
    <MeasurementUnitProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="new-password" />
      <Stack.Screen name="success" />
      <Stack.Screen name="error" />
      <Stack.Screen name="support-submitted" />
      <Stack.Screen name="support-error" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="weight" />
      <Stack.Screen name="age" />
      <Stack.Screen name="height" />
      <Stack.Screen name="sports-experience" />
      <Stack.Screen name="contact-us" />
      </Stack>
    </MeasurementUnitProvider>
  );
}
