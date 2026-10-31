import { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import {
  useFonts,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import {
  LeagueSpartan_300Light,
  LeagueSpartan_500Medium,
  LeagueSpartan_700Bold,
} from "@expo-google-fonts/league-spartan";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/features/auth/auth-context";
import {
  getAuthAccess,
  resolveAuthDestination,
  type AuthGateInput,
} from "@/features/auth/resolve-auth-destination";
import { colors, fonts, globalStyles } from "@/styles/global";

SplashScreen.preventAutoHideAsync();

function useAuthGateInput(): AuthGateInput {
  const pathname = usePathname();
  const {
    user,
    isAuthLoading,
    isProfileLoading,
    isConfigured,
    isEmailVerified,
    profile,
  } = useAuth();

  return {
    isConfigured,
    hasUser: Boolean(user),
    isAuthLoading,
    isProfileLoading,
    isEmailVerified,
    profile,
    pathname,
  };
}

function SplashScreenController({ fontsReady }: { fontsReady: boolean }) {
  const gate = useAuthGateInput();
  const { sessionReady } = getAuthAccess(gate);

  useEffect(() => {
    if (fontsReady && sessionReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsReady, sessionReady]);

  return null;
}

function RootNavigator() {
  const router = useRouter();
  const gate = useAuthGateInput();
  const { canAccessApp } = getAuthAccess(gate);
  const destination = resolveAuthDestination(gate);

  useEffect(() => {
    if (destination) {
      router.replace(destination);
    }
  }, [destination, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={canAccessApp}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      {/* Stay on auth until a pending replace into the app has landed. */}
      <Stack.Protected guard={!canAccessApp || destination != null}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.montserratExtraLight]: Montserrat_200ExtraLight,
    [fonts.montserratLight]: Montserrat_300Light,
    [fonts.montserratRegular]: Montserrat_400Regular,
    [fonts.montserratMedium]: Montserrat_500Medium,
    [fonts.montserratBold]: Montserrat_700Bold,
    [fonts.poppinsLight]: Poppins_300Light,
    [fonts.poppinsRegular]: Poppins_400Regular,
    [fonts.poppinsMedium]: Poppins_500Medium,
    [fonts.poppinsSemiBold]: Poppins_600SemiBold,
    [fonts.poppinsBold]: Poppins_700Bold,
    [fonts.leagueSpartanLight]: LeagueSpartan_300Light,
    [fonts.leagueSpartanMedium]: LeagueSpartan_500Medium,
    [fonts.leagueSpartanBold]: LeagueSpartan_700Bold,
  });

  const fontsReady = fontsLoaded || Boolean(fontError);

  return (
    <GestureHandlerRootView style={globalStyles.screen}>
      <AuthProvider>
        <SplashScreenController fontsReady={fontsReady} />
        {fontsReady ? <RootNavigator /> : null}
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
