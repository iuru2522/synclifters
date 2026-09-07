import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseFirestore, getFirebaseSetupMessage } from "@/lib/firebase";
import { coerceToMillis } from "@/lib/firestore-timestamps";
import {
  exerciseImageStoragePath,
  uploadImageFromUri,
} from "@/features/storage/upload";
import type { MeasureOption } from "@/features/workout/custom-exercise-measure";
import type { MuscleGroup } from "@/features/workout/custom-exercise-muscle";
import type { RepType } from "@/features/workout/rep-type-selection";
import type { CustomExercise } from "@/features/workout/types";

export type CreateCustomExerciseInput = {
  name: string;
  muscleGroup: MuscleGroup | string;
  measure: MeasureOption | string | null;
  repType: RepType | null;
  dropsetLvls: number | null;
  supersetExerciseName: string | null;
  /** Local picker URI; uploaded to Storage when present. */
  imageUri?: string | null;
};

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

function exercisesCollection(uid: string) {
  return collection(requireFirestore(), "users", uid, "exercises");
}

function parseRepType(value: unknown): RepType | null {
  if (value === "regular" || value === "superset" || value === "dropset") {
    return value;
  }

  return null;
}

function parseCustomExercise(
  id: string,
  data: Record<string, unknown>,
): CustomExercise | null {
  const name = typeof data.name === "string" ? data.name.trim() : "";

  if (!name) {
    return null;
  }

  return {
    id,
    name,
    muscleGroup:
      typeof data.muscleGroup === "string" && data.muscleGroup.trim()
        ? data.muscleGroup
        : "Triceps",
    measure: typeof data.measure === "string" ? data.measure : null,
    repType: parseRepType(data.repType),
    dropsetLvls:
      typeof data.dropsetLvls === "number" && Number.isFinite(data.dropsetLvls)
        ? Math.max(0, Math.floor(data.dropsetLvls))
        : null,
    supersetExerciseName:
      typeof data.supersetExerciseName === "string"
        ? data.supersetExerciseName
        : null,
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : null,
    createdAt: coerceToMillis(data.createdAt),
  };
}

export async function createCustomExercise(
  uid: string,
  input: CreateCustomExerciseInput,
): Promise<CustomExercise> {
  const trimmedName = input.name.trim();

  if (!trimmedName) {
    throw new Error("Enter an exercise name.");
  }

  const exerciseRef = doc(exercisesCollection(uid));
  let imageUrl: string | null = null;

  if (input.imageUri?.trim()) {
    imageUrl = await uploadImageFromUri({
      path: exerciseImageStoragePath(uid, exerciseRef.id),
      uri: input.imageUri.trim(),
    });
  }

  const payload = {
    name: trimmedName,
    muscleGroup: input.muscleGroup,
    measure: input.measure,
    repType: input.repType,
    dropsetLvls: input.dropsetLvls,
    supersetExerciseName: input.supersetExerciseName,
    imageUrl,
    createdAt: serverTimestamp(),
  };

  await setDoc(exerciseRef, payload);

  return {
    id: exerciseRef.id,
    name: trimmedName,
    muscleGroup: input.muscleGroup,
    measure: input.measure,
    repType: input.repType,
    dropsetLvls: input.dropsetLvls,
    supersetExerciseName: input.supersetExerciseName,
    imageUrl,
    createdAt: Date.now(),
  };
}

export async function listCustomExercises(uid: string): Promise<CustomExercise[]> {
  const snapshot = await getDocs(exercisesCollection(uid));

  return snapshot.docs
    .map((item) =>
      parseCustomExercise(item.id, item.data() as Record<string, unknown>),
    )
    .filter((item): item is CustomExercise => item != null)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function getCustomExercise(
  uid: string,
  exerciseId: string,
): Promise<CustomExercise | null> {
  const snapshot = await getDoc(doc(exercisesCollection(uid), exerciseId));

  if (!snapshot.exists()) {
    return null;
  }

  return parseCustomExercise(
    snapshot.id,
    snapshot.data() as Record<string, unknown>,
  );
}
