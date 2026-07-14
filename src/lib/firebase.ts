import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

export type FirebaseClientConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
};

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey?.trim()) &&
  Boolean(firebaseConfig.authDomain?.trim()) &&
  Boolean(firebaseConfig.projectId?.trim()) &&
  Boolean(firebaseConfig.storageBucket?.trim()) &&
  Boolean(firebaseConfig.messagingSenderId?.trim()) &&
  Boolean(firebaseConfig.appId?.trim());

let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!authInstance) {
    authInstance = getAuth(app);
  }

  return authInstance;
}

export function getFirebaseFirestore(): Firestore | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app);
  }

  return firestoreInstance;
}

export function getFirebaseSetupMessage(): string {
  return [
    "Add your Firebase web config to .env using EXPO_PUBLIC_FIREBASE_* values.",
    "Also add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID for Google sign-in.",
  ].join(" ");
}

export const googleProvider = new GoogleAuthProvider();
