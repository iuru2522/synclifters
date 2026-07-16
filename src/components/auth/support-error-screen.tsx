import { colors, globalStyles, spacing } from "@/styles/global";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { AuthBackButton } from "./auth-back-button";
import { AuthResultWrenchIcon } from "./auth-result-wrench-icon";

export function SupportErrorScreen() {
  return (
    <View style={globalStyles.signUpScreen}>
      <View style={globalStyles.successHeader}>
        <AuthBackButton
          href="/sign-in"
          title="Error"
          color={colors.resetButtonBorder}
          gap={spacing.authBackTitleSupportError}
        />

        <View style={globalStyles.supportResultBody}>
          <View style={globalStyles.authResultCardShadow}>
            <View style={[globalStyles.successCard, globalStyles.errorResultCard]}>
              <Text style={[globalStyles.successCardText, globalStyles.successCardTextError]}>
                Something Went Wrong :(
              </Text>
              <AuthResultWrenchIcon
                tintColor={colors.resetButtonBorder}
                accessibilityLabel="Error"
                innerCircleStyle={globalStyles.successCardIconCircleError}
              />
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="OK"
            onPress={() => {
              router.replace({
                pathname: "/contact-us",
                params: { returnTo: "/support-error" },
              });
            }}
          >
            <Text style={globalStyles.supportErrorOk}>OK</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
