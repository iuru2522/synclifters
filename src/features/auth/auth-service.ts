import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirebaseAuth, getFirebaseSetupMessage } from "@/lib/firebase";

export type AuthMode = "signin" | "register";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly cancelled = false,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

let googleSignInConfigured = false;

export function configureAuthProviders(): void {
  if (googleSignInConfigured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
  googleSignInConfigured = true;
}

export async function isAppleSignInAvailable(): Promise<boolean> {
  return AppleAuthentication.isAvailableAsync();
}

function requireAuth(): Auth {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new AuthServiceError(getFirebaseSetupMessage(), "SETUP_REQUIRED");
  }

  return auth;
}

export async function signInWithEmail(
  email: string,
  password: string,
  mode: AuthMode,
): Promise<void> {
  const auth = requireAuth();

  if (mode === "signin") {
    await signInWithEmailAndPassword(auth, email, password);
    return;
  }

  await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle(): Promise<void> {
  const auth = requireAuth();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const result = await GoogleSignin.signIn();
    const idToken = result.data?.idToken ?? (result as { idToken?: string }).idToken;

    if (!idToken) {
      throw new AuthServiceError("No ID token returned from Google Sign-In.");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  } catch (error: unknown) {
    if (error instanceof AuthServiceError) {
      throw error;
    }

    const authError = error as { code?: string; message?: string };

    if (authError.code === "SIGN_IN_CANCELLED") {
      throw new AuthServiceError("Google sign-in was cancelled.", authError.code, true);
    }

    throw new AuthServiceError(authError.message ?? "Google sign-in failed.", authError.code);
  }
}

export async function signInWithApple(): Promise<void> {
  const auth = requireAuth();

  try {
    const nonce = Crypto.randomUUID();
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce,
    );

    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!appleCredential.identityToken) {
      throw new AuthServiceError("No identity token returned from Apple Sign-In.");
    }

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: appleCredential.identityToken,
      rawNonce: nonce,
    });

    await signInWithCredential(auth, credential);
  } catch (error: unknown) {
    if (error instanceof AuthServiceError) {
      throw error;
    }

    const authError = error as { code?: string; message?: string };

    if (authError.code === "ERR_REQUEST_CANCELED") {
      throw new AuthServiceError("Apple sign-in was cancelled.", authError.code, true);
    }

    throw new AuthServiceError(authError.message ?? "Apple sign-in failed.", authError.code);
  }
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore if the user was not signed in with Google.
  }

  await getFirebaseAuth()?.signOut();
}
