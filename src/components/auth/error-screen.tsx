import { AppButton } from "@/components/app-button";
import { colors, globalStyles, spacing } from "@/styles/global";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { AuthBackButton } from "./auth-back-button";
import { AuthResultWrenchIcon } from "./auth-result-wrench-icon";

export function ErrorScreen() {
  return (
    <View style={globalStyles.signUpScreen}>
      <View style={globalStyles.successHeader}>
        <AuthBackButton
          href="/sign-in"
          title="Error"
          color={colors.resetButtonBorder}
          gap={spacing.authBackTitleError}
        />

        <View style={globalStyles.successBody}>
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

          <View style={globalStyles.errorFormActions}>
            <AppButton
              title="Try again"
              onPress={() => {
                router.replace("/forgot-password");
              }}
              pressFillColor={colors.backArrow}
              pressLabelColor={colors.inputText}
            />

            <View style={globalStyles.errorContact}>
              <Text style={globalStyles.errorOrText}>or</Text>
              <Link
                href={{ pathname: "/contact-us", params: { returnTo: "/error" } }}
                asChild
              >
                <Pressable accessibilityRole="link" accessibilityLabel="Contact us">
                  <Text style={globalStyles.signUpLoginLinkText}>Contact us</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
