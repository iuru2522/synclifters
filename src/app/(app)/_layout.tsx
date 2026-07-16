import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useAuth } from "@/features/auth/auth-context";
import { colors } from "@/styles/global";

export default function AppLayout() {
  const { user, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isConfigured || !user) {
    return <Redirect href="/sign-up" />;
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
        <NativeTabs.Trigger.Icon sf="1.circle.fill" md="looks_one" />
        <NativeTabs.Trigger.Label>Tab1</NativeTabs.Trigger.Label>
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
