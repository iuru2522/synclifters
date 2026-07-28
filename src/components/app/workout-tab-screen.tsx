import { useRouter, type Href } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuthContentPadding } from "@/components/auth/auth-screen-layout";
import { globalStyles, sizes } from "@/styles/global";

const PROFILE_HREF = "/workout/profile" as Href;

export function WorkoutTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = getAuthContentPadding(insets);

  return (
    <View style={[globalStyles.workoutScreen, topPadding]}>
      <View style={globalStyles.workoutScreenHeader}>
        <Pressable
          style={globalStyles.workoutProfileButton}
          onPress={() => {
            router.push(PROFILE_HREF);
          }}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        />
      </View>
    </View>
  );
}
