import { Button, Text } from "react-native";
import { AuthCard, authCardStyles } from "@/components/auth/auth-card";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { useAuth } from "@/features/auth/auth-context";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <AuthScreenLayout>
      <AuthCard>
        <Text style={authCardStyles.title}>You are signed in</Text>
        <Text style={authCardStyles.description}>{user?.email ?? user?.uid}</Text>
        <Button
          title="Sign out"
          onPress={() => {
            void signOut();
          }}
        />
      </AuthCard>
    </AuthScreenLayout>
  );
}
