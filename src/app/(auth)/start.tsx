import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { AuthCard, authCardStyles } from "@/components/auth/auth-card";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";

export default function StartScreen() {
  return (
    <AuthScreenLayout>
      <AuthCard>
        <Text style={authCardStyles.title}>SyncLifters</Text>

        <Link href="/sign-up-role" asChild>
          <Pressable
            style={styles.signUpButton}
            accessibilityRole="button"
            accessibilityLabel="Sign up"
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </Pressable>
        </Link>

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an Account? </Text>
          <Link href="/sign-in" asChild>
            <Pressable accessibilityRole="button" accessibilityLabel="Log In">
              <Text style={styles.loginLink}>Log In</Text>
            </Pressable>
          </Link>
        </View>
      </AuthCard>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  signUpButton: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    backgroundColor: "#111827",
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  loginRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPrompt: {
    color: "#4b5563",
    fontSize: 14,
  },
  loginLink: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
});
