import { Stack } from "expo-router";
import { colors } from "@/styles/global";

export const unstable_settings = {
  initialRouteName: "workout",
};

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="workout" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="progress" />
    </Stack>
  );
}
