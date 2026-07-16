import { doc, getDoc, serverTimestamp, setDoc, type Timestamp } from "firebase/firestore";
import { getFirebaseFirestore, getFirebaseSetupMessage } from "@/lib/firebase";

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Timestamp | null;
};

export type CreateUserProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
};

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

export async function createUserProfile(
  uid: string,
  input: CreateUserProfileInput,
): Promise<void> {
  const db = requireFirestore();
  const ref = doc(db, "users", uid);

  await setDoc(ref, {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    email: typeof data.email === "string" ? data.email : "",
    createdAt: data.createdAt ?? null,
  };
}
