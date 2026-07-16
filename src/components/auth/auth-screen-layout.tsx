import { type ReactNode, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets, type EdgeInsets } from "react-native-safe-area-context";
import { colors, globalStyles, spacing } from "@/styles/global";
import { type Href } from "expo-router";
import { AuthSkipLink } from "./auth-skip-link";
import { AuthBlurTargetProvider } from "./auth-blur-target-context";
import { AuthVideoBackground } from "./auth-video-background";
import { useAuthBack, type AuthHref } from "./use-auth-back";

export function getAuthContentPadding(insets: EdgeInsets) {
  return {
    paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
  };
}

type SwipeBackOptions =
  | true
  | {
      href?: AuthHref;
      fallbackHref?: AuthHref;
    };

export function AuthScreenLayout({
  children,
  footer,
  swipeBack,
  videoBackground = false,
  scrollable = true,
  showSkip = false,
  skipHref = "/sign-in",
}: {
  children: ReactNode;
  footer?: ReactNode;
  swipeBack?: SwipeBackOptions;
  videoBackground?: boolean;
  scrollable?: boolean;
  showSkip?: boolean;
  skipHref?: Href;
}) {
  const insets = useSafeAreaInsets();
  const blurTargetRef = useRef<View | null>(null);
  const bottomFooter = footer ?? (showSkip ? <AuthSkipLink href={skipHref} /> : null);
  const contentPadding = getAuthContentPadding(insets);
  const bottomInset = Math.max(insets.bottom, spacing.safeAreaBottomMin);
  const bottomContentPadding = bottomFooter ? null : { paddingBottom: bottomInset };
  const swipeOptions = swipeBack === true ? {} : swipeBack;
  const handleBack = useAuthBack(swipeOptions ?? {});

  const swipeGesture = Gesture.Pan()
    .enabled(Boolean(swipeBack))
    .activeOffsetX(spacing.swipeActiveOffsetX)
    .failOffsetY([-24, 24])
    .onEnd((event) => {
      const swipedBack =
        event.translationX > spacing.swipeBackTranslation ||
        (event.translationX > spacing.swipeBackFastTranslation &&
          event.velocityX > spacing.swipeBackVelocity);

      if (swipedBack) {
        runOnJS(handleBack)();
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={[styles.root, videoBackground ? styles.rootVideo : null]}>
        <StatusBar barStyle="light-content" />
        {videoBackground ? <AuthVideoBackground blurTargetRef={blurTargetRef} /> : null}
        <AuthBlurTargetProvider value={videoBackground ? blurTargetRef : null}>
          <KeyboardAvoidingView
            style={styles.foreground}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {scrollable ? (
              <ScrollView
                style={styles.mainContent}
                contentContainerStyle={[
                  globalStyles.screenContent,
                  styles.scrollContent,
                  contentPadding,
                  bottomContentPadding,
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View style={[globalStyles.screenBody, styles.mainBody]}>{children}</View>
              </ScrollView>
            ) : (
              <View
                style={[
                  globalStyles.screenContent,
                  styles.mainContent,
                  styles.staticContent,
                  contentPadding,
                  bottomContentPadding,
                ]}
              >
                <View style={[globalStyles.screenBody, styles.mainBody]}>{children}</View>
              </View>
            )}
            {bottomFooter ? (
              <View
                pointerEvents="box-none"
                style={[globalStyles.authSkipFooter, { paddingBottom: bottomInset }]}
              >
                {bottomFooter}
              </View>
            ) : null}
          </KeyboardAvoidingView>
        </AuthBlurTargetProvider>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rootVideo: {
    backgroundColor: "transparent",
  },
  foreground: {
    flex: 1,
    flexDirection: "column",
    zIndex: 2,
    backgroundColor: "transparent",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  mainBody: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
});
