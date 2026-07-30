import { useEffect } from "react";
import { Stack } from "expo-router";
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
import { AuthProvider } from "@/features/auth/auth-context";
import { colors, fonts, globalStyles } from "@/styles/global";

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={globalStyles.screen}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
