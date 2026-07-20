import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { isOnboardingSegment } from "@/features/onboarding/onboarding-routes";
import { MeasurementUnitProvider } from "@/features/onboarding/measurement-unit-context";
import { OnboardingProvider } from "@/features/onboarding/onboarding-context";
import { isOnboardingComplete } from "@/features/users/user-profile";
import { colors } from "@/styles/global";

export default function AuthLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const { user, isAuthLoading, isProfileLoading, isConfigured, profile } = useAuth();
  const currentScreen = segments[segments.length - 1] ?? "";
  const inOnboarding =
    isOnboardingSegment(currentScreen) || segments.some(isOnboardingSegment);

  useEffect(() => {
    if (isAuthLoading || (user && isProfileLoading && !profile)) {
      return;
    }

    if (!isConfigured || !user) {
      return;
    }

    if (isOnboardingComplete(profile)) {
      if (inOnboarding) {
        router.replace("/");
      }

      return;
    }

    if (!inOnboarding && !pathname.startsWith("/gender")) {
      router.replace("/gender");
    }
  }, [
    inOnboarding,
    isAuthLoading,
    isConfigured,
    isProfileLoading,
    pathname,
    profile,
    router,
    user,
  ]);

  if (isAuthLoading || (user && isProfileLoading && !profile)) {
    return null;
  }

  return (
    <MeasurementUnitProvider>
      <OnboardingProvider>
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
      </OnboardingProvider>
    </MeasurementUnitProvider>
  );
}
