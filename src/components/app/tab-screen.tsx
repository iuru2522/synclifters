import { Button, Text, View } from "react-native";
import { useAuth } from "@/features/auth/auth-context";
import { globalStyles } from "@/styles/global";

type TabScreenProps = {
  title: string;
  showSignOut?: boolean;
};

export function TabScreen({ title, showSignOut = false }: TabScreenProps) {
  const { signOut } = useAuth();

  return (
    <View style={[globalStyles.screenContent, globalStyles.tabScreen]}>
      <View style={globalStyles.tabScreenContent}>
        <Text style={[globalStyles.title, globalStyles.tabScreenText]}>{title}</Text>
        {showSignOut ? (
          <Button
            title="Sign out"
            onPress={() => {
              void signOut();
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
