import { Stack, usePathname, useRouter, type Href } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { isOnboardingComplete } from "@/features/users/user-profile";
import { colors } from "@/styles/global";

const VERIFY_EMAIL_HREF = "/verify-email" as Href;

export default function AppLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    isAuthLoading,
    isProfileLoading,
    isConfigured,
    isEmailVerified,
    profile,
  } = useAuth();

  useEffect(() => {
    if (isAuthLoading || (user && isProfileLoading && !profile)) {
      return;
    }

    if (!isConfigured || !user) {
      if (!pathname.startsWith("/sign-up") && !pathname.startsWith("/sign-in")) {
        router.replace("/sign-up");
      }

      return;
    }

    if (!isEmailVerified) {
      if (!pathname.startsWith("/verify-email")) {
        router.replace(VERIFY_EMAIL_HREF);
      }

      return;
    }

    if (!isOnboardingComplete(profile) && !pathname.startsWith("/gender")) {
      router.replace("/gender");
    }
  }, [
    isAuthLoading,
    isConfigured,
    isEmailVerified,
    isProfileLoading,
    pathname,
    profile,
    router,
    user,
  ]);

  if (isAuthLoading || (user && isProfileLoading && !profile)) {
    return null;
  }

  if (!isConfigured || !user || !isEmailVerified || !isOnboardingComplete(profile)) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
