import { Button, Text, View } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { useAuth } from "@/features/auth/auth-context";
import { globalStyles } from "@/styles/global";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <AuthScreenLayout>
      <View style={globalStyles.card}>
        <Text style={globalStyles.title}>You are signed in</Text>
        <Text style={globalStyles.description}>{user?.email ?? user?.uid}</Text>
        <Button
          title="Sign out"
          onPress={() => {
            void signOut();
          }}
        />
      </View>
    </AuthScreenLayout>
  );
}
