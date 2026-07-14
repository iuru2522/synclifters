import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SyncLiftersLogo } from "@/components/brand/sync-lifters-logo";
import { globalStyles } from "@/styles/global";

export default function StartScreen() {
  return (
    <AuthScreenLayout>
      <View style={globalStyles.startCard}>
        <SyncLiftersLogo />

        <View>
          <Link href="/sign-up-role" asChild>
            <Pressable
              style={globalStyles.startSignUpButton}
              accessibilityRole="button"
              accessibilityLabel="Sign Up"
            >
              <Text style={globalStyles.startSignUpButtonText}>Sign Up</Text>
            </Pressable>
          </Link>

          <View style={globalStyles.startPromptRow}>
            <Text style={globalStyles.promptText}>Already Have an Account? </Text>
            <Link href="/sign-in" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Log In">
                <Text style={globalStyles.promptLink}>Log In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
