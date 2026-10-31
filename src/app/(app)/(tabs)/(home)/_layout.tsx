import { Stack } from "expo-router";
import { colors } from "@/styles/global";

export const unstable_settings = {
  initialRouteName: "workout",
};

const fieldSheetOptions = {
  presentation: "transparentModal" as const,
  animation: "slide_from_bottom" as const,
  headerShown: false,
  contentStyle: { backgroundColor: colors.surface },
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
      <Stack.Screen name="weight-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="height-sheet" options={fieldSheetOptions} />
    </Stack>
  );
}
