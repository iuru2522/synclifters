import { Text } from "react-native";
import { getFirebaseSetupMessage } from "@/lib/firebase";
import { globalStyles } from "@/styles/global";
import { AuthCard } from "./auth-card";

export function FirebaseSetupCard() {
  return (
    <AuthCard>
      <Text style={globalStyles.title}>Firebase auth setup</Text>
      <Text style={globalStyles.description}>{getFirebaseSetupMessage()}</Text>
    </AuthCard>
  );
}
