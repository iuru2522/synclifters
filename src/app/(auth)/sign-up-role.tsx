import { useState } from "react";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { SyncLiftersLogo } from "@/components/brand/sync-lifters-logo";
import type { UserRole } from "@/features/users/user-profile";
import { globalStyles } from "@/styles/global";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SignUpRoleScreen() {
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  function handleSelectRole(role: UserRole) {
    setActiveRole(role);
    router.push({ pathname: "/sign-up", params: { role } });
  }

  return (
    <AuthScreenLayout>
      <View style={globalStyles.card}>
        <AuthBackButton />

        <SyncLiftersLogo />

        <Text style={globalStyles.heroTitle}>
          Create <Text style={globalStyles.brandAccentBold}>SL</Text> Account{"\n"}as:
        </Text>

        <Pressable
          style={
            activeRole === "athlete" ? globalStyles.outlineButtonActive : globalStyles.outlineButton
          }
          onPress={() => handleSelectRole("athlete")}
          accessibilityRole="button"
          accessibilityState={{ selected: activeRole === "athlete" }}
          accessibilityLabel="Athlete"
        >
          <Text
            style={
              activeRole === "athlete"
                ? globalStyles.outlineButtonTextActive
                : globalStyles.outlineButtonText
            }
          >
            Athlete
          </Text>
        </Pressable>

        <Pressable
          style={
            activeRole === "coach" ? globalStyles.outlineButtonActive : globalStyles.outlineButton
          }
          onPress={() => handleSelectRole("coach")}
          accessibilityRole="button"
          accessibilityState={{ selected: activeRole === "coach" }}
          accessibilityLabel="Coach"
        >
          <Text
            style={
              activeRole === "coach"
                ? globalStyles.outlineButtonTextActive
                : globalStyles.outlineButtonText
            }
          >
            Coach
          </Text>
        </Pressable>
      </View>
    </AuthScreenLayout>
  );
}
