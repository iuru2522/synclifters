import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuthContentPadding } from "@/components/auth/auth-screen-layout";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileFields } from "@/features/users/profile-display";
import { globalStyles, spacing } from "@/styles/global";

function ProfileFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={globalStyles.profileFieldRow}>
      <Text style={globalStyles.profileFieldLabel}>{label}</Text>
      <Text style={globalStyles.profileFieldValue}>{value}</Text>
    </View>
  );
}

export function ProfileCard() {
  const { profile } = useAuth();
  const fields = formatProfileFields(profile);

  return (
    <View style={globalStyles.authResultCardShadow}>
      <View style={globalStyles.profileCard}>
        <View style={globalStyles.profileCardFields}>
          {fields.map((field) => (
            <ProfileFieldRow key={field.label} label={field.label} value={field.value} />
          ))}
        </View>
      </View>
    </View>
  );
}

export function ProfileTabScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = getAuthContentPadding(insets);
  const bottomPadding = Math.max(insets.bottom, spacing.safeAreaBottomMin);

  return (
    <View
      style={[
        globalStyles.screen,
        globalStyles.profileScreenContent,
        topPadding,
        { paddingBottom: bottomPadding },
      ]}
    >
      <View style={globalStyles.profileScreenBody}>
        <ProfileCard />
      </View>
    </View>
  );
}
