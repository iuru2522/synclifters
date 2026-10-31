import { Stack } from "expo-router";
import { colors } from "@/styles/global";

export default function ProgressLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="progress-muscle" />
      <Stack.Screen name="progress-metric" />
      <Stack.Screen name="progress-metric-detail" />
    </Stack>
  );
}
