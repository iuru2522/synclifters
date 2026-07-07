import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import {
  configureAuthProviders,
  isAppleSignInAvailable,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  type AuthMode,
} from "./auth-service";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  isAppleSignInAvailable: boolean;
  signInWithEmail: (email: string, password: string, mode: AuthMode) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appleSignInAvailable, setAppleSignInAvailable] = useState(false);

  useEffect(() => {
    configureAuthProviders();
    void isAppleSignInAvailable().then(setAppleSignInAvailable);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      setIsLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isConfigured: isFirebaseConfigured,
      isAppleSignInAvailable: appleSignInAvailable,
      signInWithEmail,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }),
    [user, isLoading, appleSignInAvailable],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
