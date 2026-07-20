import { View } from "react-native";
import { type Href } from "expo-router";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles } from "@/styles/global";
import { AuthSkipLink } from "./auth-skip-link";

type AuthFormFooterProps = {
  onNext: () => void;
  nextTitle?: string;
  nextDisabled?: boolean;
  skipHref?: Href;
  onSkipPress?: () => void | Promise<void>;
  skipDisabled?: boolean;
  showSkip?: boolean;
  showNext?: boolean;
};

export function AuthFormFooter({
  onNext,
  nextTitle = "Next",
  nextDisabled = false,
  skipHref = "/sign-in",
  onSkipPress,
  skipDisabled = false,
  showSkip = true,
  showNext = true,
}: AuthFormFooterProps) {
  return (
    <View style={globalStyles.authFormFooter}>
      <View
        pointerEvents={showNext ? "auto" : "none"}
        style={[
          globalStyles.authFormFooterButtonRow,
          showNext ? null : globalStyles.authFormFooterButtonRowHidden,
        ]}
      >
        <AppButton
          title={nextTitle}
          onPress={onNext}
          disabled={nextDisabled}
          borderColor={colors.inputFill}
          textColor={colors.inputFill}
          pressAccentColor={colors.backArrow}
          style={globalStyles.authFormFooterNextButton}
        />
      </View>
      {showSkip ? (
        <AuthSkipLink href={skipHref} onPress={onSkipPress} disabled={skipDisabled || nextDisabled} />
      ) : null}
    </View>
  );
}
