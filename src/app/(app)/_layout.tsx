import { usePathname, useRouter, type Href } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "@/features/auth/auth-context";
import { isOnboardingComplete } from "@/features/users/user-profile";
import { colors, globalStyles } from "@/styles/global";

const VERIFY_EMAIL_HREF = "/verify-email" as Href;
const tabBarLabelStyle = globalStyles.tabBarLabel;
const tabBarLabelActiveStyle = globalStyles.tabBarLabelActive;

const tabIcons = {
  history: {
    default: require("../../../assets/images/tabIcons/book-inactive.png"),
    selected: require("../../../assets/images/tabIcons/book-active.png"),
  },
  workout: {
    default: require("../../../assets/images/tabIcons/home-inactive.png"),
    selected: require("../../../assets/images/tabIcons/home-active.png"),
  },
  menu: {
    default: require("../../../assets/images/tabIcons/qrcode-inactive.png"),
    selected: require("../../../assets/images/tabIcons/qrcode-active.png"),
  },
} as const;

function AppTabs() {
  return (
    <View style={globalStyles.screen}>
      <NativeTabs
        labelStyle={{
          default: tabBarLabelStyle,
          selected: tabBarLabelActiveStyle,
        }}
        iconColor={{
          default: colors.tabBarInactive,
          selected: colors.backArrow,
        }}
        tintColor={colors.backArrow}
      >
        <NativeTabs.Trigger name="history">
          <NativeTabs.Trigger.Icon src={tabIcons.history} renderingMode="original" />
          <NativeTabs.Trigger.Label selectedStyle={tabBarLabelActiveStyle}>
            History
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="workout">
          <NativeTabs.Trigger.Icon src={tabIcons.workout} renderingMode="original" />
          <NativeTabs.Trigger.Label selectedStyle={tabBarLabelActiveStyle}>
            Workout
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Icon src={tabIcons.menu} renderingMode="original" />
          <NativeTabs.Trigger.Label selectedStyle={tabBarLabelActiveStyle}>
            Menu
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}

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

  return <AppTabs />;
}
