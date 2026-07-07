import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export function AuthCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export const authCardStyles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
});

const styles = authCardStyles;
