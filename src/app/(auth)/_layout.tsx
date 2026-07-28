import { Stack, usePathname, useRouter, useSegments, type Href } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { isOnboardingSegment } from "@/features/onboarding/onboarding-routes";
import { MeasurementUnitProvider } from "@/features/onboarding/measurement-unit-context";
import { OnboardingProvider } from "@/features/onboarding/onboarding-context";
import { isOnboardingComplete } from "@/features/users/user-profile";
import { colors } from "@/styles/global";

const VERIFY_EMAIL_HREF = "/verify-email" as Href;

export default function AuthLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const {
    user,
    isAuthLoading,
    isProfileLoading,
    isConfigured,
    isEmailVerified,
    profile,
  } = useAuth();
  const currentScreen = segments[segments.length - 1] ?? "";
  const inOnboarding =
    isOnboardingSegment(currentScreen) || segments.some(isOnboardingSegment);
  const onVerifyEmail = pathname.includes("verify-email");

  useEffect(() => {
    if (isAuthLoading || (user && isProfileLoading && !profile)) {
      return;
    }

    if (!isConfigured || !user) {
      return;
    }

    if (!isEmailVerified) {
      if (!onVerifyEmail) {
        router.replace(VERIFY_EMAIL_HREF);
      }

      return;
    }

    if (isOnboardingComplete(profile)) {
      if (inOnboarding || onVerifyEmail) {
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
    isEmailVerified,
    isProfileLoading,
    onVerifyEmail,
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
          <Stack.Screen name="verify-email" />
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
