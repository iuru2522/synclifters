import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import {
  getUserProfile,
  type UserProfile,
} from "@/features/users/user-profile";
import {
  configureAuthProviders,
  isAppleSignInAvailable,
  sendPasswordReset,
  setNewPassword,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  type AuthMode,
  type SignInWithEmailOptions,
} from "./auth-service";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  isConfigured: boolean;
  isAppleSignInAvailable: boolean;
  refreshProfile: (options?: { silent?: boolean }) => Promise<void>;
  patchProfile: (patch: Partial<UserProfile>) => void;
  signInWithEmail: (
    email: string,
    password: string,
    mode: AuthMode,
    options?: SignInWithEmailOptions,
  ) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  setNewPassword: (oobCode: string, newPassword: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [appleSignInAvailable, setAppleSignInAvailable] = useState(false);

  useEffect(() => {
    configureAuthProviders();
    void isAppleSignInAvailable().then(setAppleSignInAvailable);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      setIsAuthLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });
  }, []);

  const patchProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const refreshProfile = useCallback(async (options?: { silent?: boolean }) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const silent = options?.silent ?? false;

    if (!silent) {
      setIsProfileLoading(true);
    }

    try {
      const nextProfile = await getUserProfile(user.uid);
      setProfile(nextProfile);
    } catch {
      if (!silent) {
        setProfile(null);
      }
    } finally {
      if (!silent) {
        setIsProfileLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);

    void getUserProfile(user.uid)
      .then((nextProfile) => {
        if (!cancelled) {
          setProfile(nextProfile);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfile(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsProfileLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading: isAuthLoading || isProfileLoading,
      isAuthLoading,
      isProfileLoading,
      isConfigured: isFirebaseConfigured,
      isAppleSignInAvailable: appleSignInAvailable,
      refreshProfile,
      patchProfile,
      signInWithEmail,
      sendPasswordReset,
      setNewPassword,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }),
    [
      user,
      profile,
      isAuthLoading,
      isProfileLoading,
      appleSignInAvailable,
      refreshProfile,
      patchProfile,
    ],
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
