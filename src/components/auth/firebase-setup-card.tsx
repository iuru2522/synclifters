import { Text } from "react-native";
import { getFirebaseSetupMessage } from "@/lib/firebase";
import { AuthCard, authCardStyles } from "./auth-card";

export function FirebaseSetupCard() {
  return (
    <AuthCard>
      <Text style={authCardStyles.title}>Firebase auth setup</Text>
      <Text style={authCardStyles.description}>{getFirebaseSetupMessage()}</Text>
    </AuthCard>
  );
}
