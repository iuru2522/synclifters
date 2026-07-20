import { usePathname, useRouter, type Href } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
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
    <NativeTabs
      labelStyle={{
        default: { color: colors.black },
        selected: { color: colors.black },
      }}
      tintColor={colors.black}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="person.circle.fill" md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab2">
        <NativeTabs.Trigger.Icon sf="2.circle.fill" md="looks_two" />
        <NativeTabs.Trigger.Label>Tab2</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
