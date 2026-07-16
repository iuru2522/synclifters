import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { colors, globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";
import { AuthResultWrenchIcon } from "./auth-result-wrench-icon";

export function SupportSubmittedScreen() {
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const rawReturnTo = params.returnTo;
  const returnTo = (Array.isArray(rawReturnTo) ? rawReturnTo[0] : rawReturnTo) ?? "/sign-in";

  function handleOk() {
    router.dismissTo(returnTo as Href);
  }

  return (
    <View style={globalStyles.signUpScreen}>
      <View style={globalStyles.successHeader}>
        <AuthBackButton
          href="/sign-in"
          title="Submitted"
          color={colors.supportHeader}
          gap={spacing.authBackTitleSupportSubmitted}
        />

        <View style={globalStyles.supportResultBody}>
          <View style={globalStyles.authResultCardShadow}>
            <View style={[globalStyles.successCard, globalStyles.supportSubmittedCard]}>
              <Text style={[globalStyles.successCardText, globalStyles.successCardTextSupport]}>
                Submitted ^ _ ^
              </Text>
              <AuthResultWrenchIcon
                tintColor={colors.supportHeader}
                accessibilityLabel="Submitted"
              />
            </View>
          </View>

          <View style={globalStyles.successActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="OK" onPress={handleOk}>
              {({ pressed }) => (
                <Text
                  style={[
                    globalStyles.supportSubmittedOk,
                    pressed ? { color: colors.supportHeader } : null,
                  ]}
                >
                  OK
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
