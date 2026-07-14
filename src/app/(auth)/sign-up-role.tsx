import { AuthCard, authCardStyles } from "@/components/auth/auth-card";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import type { UserRole } from "@/features/users/user-profile";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function SignUpRoleScreen() {
  function handleSelectRole(role: UserRole) {
    router.push({ pathname: "/sign-up", params: { role } });
  }

  return (
    <AuthScreenLayout>
      <AuthCard>
        <Text style={authCardStyles.title}>Sign up Coach/Athlete</Text>

        <Pressable
          style={styles.roleButton}
          onPress={() => handleSelectRole("athlete")}
          accessibilityRole="button"
          accessibilityLabel="Athlete"
        >
          <Text style={styles.roleButtonText}>Athlete</Text>
        </Pressable>

        <Pressable
          style={styles.roleButton} 
          onPress={() => handleSelectRole("coach")}
          accessibilityRole="button"
          accessibilityLabel="Coach"
        >
          <Text style={styles.roleButtonText}>Coach</Text>
        </Pressable>
      </AuthCard>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  roleButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
