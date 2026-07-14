import { useEffect } from "react";
import { Stack } from "expo-router";
import {
  useFonts,
  Montserrat_200ExtraLight,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/features/auth/auth-context";
import { fonts } from "@/styles/global";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.montserratExtraLight]: Montserrat_200ExtraLight,
    [fonts.montserratRegular]: Montserrat_400Regular,
    [fonts.montserratMedium]: Montserrat_500Medium,
    [fonts.montserratBold]: Montserrat_700Bold,
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
