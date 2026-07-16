import { Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/app-button";
import { globalStyles, colors, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";
import { AuthResultWrenchIcon } from "./auth-result-wrench-icon";

export function SuccessScreen() {
  return (
    <View style={globalStyles.signUpScreen}>
      <View style={globalStyles.successHeader}>
        <AuthBackButton href="/sign-in" title="Success" gap={spacing.authBackTitleSuccess} />

        <View style={globalStyles.successBody}>
          <View style={globalStyles.authResultCardShadow}>
            <View style={[globalStyles.successCard, globalStyles.successResultCard]}>
              <Text style={globalStyles.successCardText}>Success ^ _ ^</Text>
              <AuthResultWrenchIcon
                accessibilityLabel="Success"
                innerCircleStyle={globalStyles.successCardIconCircleSuccess}
              />
            </View>
          </View>

          <View style={globalStyles.successActions}>
            <AppButton
              title="Log In"
              onPress={() => {
                router.replace("/sign-in");
              }}
              pressFillColor={colors.backArrow}
              pressLabelColor={colors.inputText}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
