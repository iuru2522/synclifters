import { createContext, useContext, type ReactNode, type RefObject } from "react";
import { View } from "react-native";

const AuthBlurTargetContext = createContext<RefObject<View | null> | null>(null);

export function AuthBlurTargetProvider({
  value,
  children,
}: {
  value: RefObject<View | null> | null;
  children: ReactNode;
}) {
  return <AuthBlurTargetContext.Provider value={value}>{children}</AuthBlurTargetContext.Provider>;
}

export function useAuthBlurTarget() {
  return useContext(AuthBlurTargetContext);
}
