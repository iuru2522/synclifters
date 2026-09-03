import { Redirect, type Href } from "expo-router";

const WORKOUT_HREF = "/workout" as Href;

export default function SettingsScreen() {
  return <Redirect href={WORKOUT_HREF} />;
}
