import { Pressable, Text } from "react-native";
import { router, useNavigation } from "expo-router";
import { globalStyles } from "@/styles/global";

type AuthHref = "/start" | "/sign-in" | "/sign-up-role";

type AuthBackButtonProps = {
  /** Always navigate here (skips history). */
  href?: AuthHref;
  /** Used only when there is no navigation history. */
  fallbackHref?: AuthHref;
};

export function AuthBackButton({ href, fallbackHref = "/start" }: AuthBackButtonProps) {
  const navigation = useNavigation();

  function handleBack() {
    if (href) {
      router.replace(href);
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    router.replace(fallbackHref);
  }

  return (
    <Pressable
      style={globalStyles.closeButton}
      onPress={handleBack}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <Text style={globalStyles.closeButtonText}>×</Text>
    </Pressable>
  );
}
