import { usePathname, useRouter } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { isOnboardingComplete } from "@/features/users/user-profile";
import { colors } from "@/styles/global";

export default function AppLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthLoading, isProfileLoading, isConfigured, profile } = useAuth();

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

    if (!isOnboardingComplete(profile) && !pathname.startsWith("/gender")) {
      router.replace("/gender");
    }
  }, [
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

  if (!isConfigured || !user || !isOnboardingComplete(profile)) {
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
