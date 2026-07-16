import { useCallback } from "react";
import { router, useNavigation } from "expo-router";

export type AuthHref =
  | "/sign-in"
  | "/sign-up"
  | "/gender"
  | "/weight"
  | "/age"
  | "/height"
  | "/sports-experience";

type UseAuthBackOptions = {
  href?: AuthHref;
  fallbackHref?: AuthHref;
};

export function useAuthBack({
  href,
  fallbackHref = "/sign-up",
}: UseAuthBackOptions = {}) {
  const navigation = useNavigation();

  return useCallback(() => {
    if (href) {
      router.dismissTo(href);
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    router.replace(fallbackHref);
  }, [fallbackHref, href, navigation]);
}
