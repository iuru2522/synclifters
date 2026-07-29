import { Stack } from "expo-router";
import { colors } from "@/styles/global";

const fieldSheetOptions = {
  presentation: "transparentModal" as const,
  animation: "slide_from_bottom" as const,
  headerShown: false,
  contentStyle: { backgroundColor: colors.surface },
};

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="name-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="email-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="birthday-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="weight-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="height-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="gender-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="sports-experience-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="metrics-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="week-day-sheet" options={fieldSheetOptions} />
    </Stack>
  );
}
