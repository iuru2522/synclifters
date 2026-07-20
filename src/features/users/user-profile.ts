import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore, getFirebaseSetupMessage } from "@/lib/firebase";

export type UserGender = "male" | "female";
export type UserSportsExperience = "beginner" | "gym-rat" | "beast-mode";
export type UserWeightUnit = "kg" | "lb";

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Timestamp | null;
  gender?: UserGender | null;
  weight?: number | null;
  weightUnit?: UserWeightUnit | null;
  age?: number | null;
  height?: number | null;
  sportsExperience?: UserSportsExperience | null;
  onboardingComplete?: boolean;
};

export type CreateUserProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
};

export type UpdateUserProfileInput = Partial<
  Pick<
    UserProfile,
    | "gender"
    | "weight"
    | "weightUnit"
    | "age"
    | "height"
    | "sportsExperience"
    | "onboardingComplete"
  >
>;

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

function parseGender(value: unknown): UserGender | null | undefined {
  if (value === "male" || value === "female") {
    return value;
  }

  if (value === null) {
    return null;
  }

  return undefined;
}

function parseSportsExperience(value: unknown): UserSportsExperience | null | undefined {
  if (value === "beginner" || value === "gym-rat" || value === "beast-mode") {
    return value;
  }

  if (value === null) {
    return null;
  }

  return undefined;
}

function parseWeightUnit(value: unknown): UserWeightUnit | null | undefined {
  if (value === "kg" || value === "lb") {
    return value;
  }

  if (value === null) {
    return null;
  }

  return undefined;
}

function parseNumber(value: unknown): number | null | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (value === null) {
    return null;
  }

  return undefined;
}

export function isOnboardingComplete(profile: UserProfile | null | undefined): boolean {
  return profile?.onboardingComplete === true;
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

export async function updateUserProfile(
  uid: string,
  input: UpdateUserProfileInput,
): Promise<void> {
  const db = requireFirestore();
  const ref = doc(db, "users", uid);

  const payload: Record<string, unknown> = {};

  if ("gender" in input) {
    payload.gender = input.gender ?? null;
  }

  if ("weight" in input) {
    payload.weight = input.weight ?? null;
  }

  if ("weightUnit" in input) {
    payload.weightUnit = input.weightUnit ?? null;
  }

  if ("age" in input) {
    payload.age = input.age ?? null;
  }

  if ("height" in input) {
    payload.height = input.height ?? null;
  }

  if ("sportsExperience" in input) {
    payload.sportsExperience = input.sportsExperience ?? null;
  }

  if ("onboardingComplete" in input) {
    payload.onboardingComplete = input.onboardingComplete ?? false;
  }

  await setDoc(ref, payload, { merge: true });
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
    gender: parseGender(data.gender),
    weight: parseNumber(data.weight),
    weightUnit: parseWeightUnit(data.weightUnit),
    age: parseNumber(data.age),
    height: parseNumber(data.height),
    sportsExperience: parseSportsExperience(data.sportsExperience),
    onboardingComplete: data.onboardingComplete === true,
  };
}
