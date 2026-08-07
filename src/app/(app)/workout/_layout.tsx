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
      <Stack.Screen name="create-program" />
      <Stack.Screen name="create-day" />
      <Stack.Screen name="create-day-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="add-exercise-to-day" />
      <Stack.Screen name="add-exercise" />
      <Stack.Screen name="exercise" />
      <Stack.Screen name="do-exercise" />
      <Stack.Screen name="custom-exercise" />
      <Stack.Screen name="exercise-history" />
      <Stack.Screen name="start-workout" />
      <Stack.Screen name="program-day" />
      <Stack.Screen name="program-day-exercise" />

      <Stack.Screen name="name-sheet" options={fieldSheetOptions} />

      <Stack.Screen name="email-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="birthday-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="weight-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="height-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="gender-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="sports-experience-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="metrics-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="exercise-name-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="muscle-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="measure-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="week-day-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="rep-type-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="dropset-lvls-sheet" options={fieldSheetOptions} />
      <Stack.Screen name="superset-exercise-sheet" options={fieldSheetOptions} />
    </Stack>
  );
}
