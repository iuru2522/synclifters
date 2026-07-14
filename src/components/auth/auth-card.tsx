import { type ReactNode } from "react";
import { View } from "react-native";
import { globalStyles } from "@/styles/global";

export function AuthCard({ children }: { children: ReactNode }) {
  return <View style={globalStyles.card}>{children}</View>;
}
