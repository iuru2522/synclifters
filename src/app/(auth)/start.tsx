import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SyncLiftersLogo } from "@/components/brand/sync-lifters-logo";
import { globalStyles } from "@/styles/global";

export default function StartScreen() {
  return (
    <AuthScreenLayout>
      <View style={globalStyles.card}>
        <SyncLiftersLogo />

        <Link href="/sign-up-role" asChild>
          <Pressable
            style={globalStyles.primaryButtonFilled}
            accessibilityRole="button"
            accessibilityLabel="Sign up"
          >
            <Text style={globalStyles.primaryButtonFilledText}>Sign up</Text>
          </Pressable>
        </Link>

        <View style={globalStyles.promptRow}>
          <Text style={globalStyles.promptText}>Already Have an Account? </Text>
          <Link href="/sign-in" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Log In">
              <Text style={globalStyles.promptLink}>Log In</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
