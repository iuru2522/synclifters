import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";
import { getFirebaseFirestore, getFirebaseSetupMessage, getFirebaseStorage } from "@/lib/firebase";
import { profileImageStoragePath } from "@/features/storage/upload";

const USER_SUBCOLLECTIONS = [
  "programs",
  "exercises",
  "bodyMetrics",
  "activity",
  "sessions",
] as const;

const BATCH_LIMIT = 400;

function requireFirestore(): Firestore {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

async function deleteQueryInBatches(
  db: Firestore,
  collectionPath: string,
): Promise<void> {
  const snapshot = await getDocs(collection(db, collectionPath));

  if (snapshot.empty) {
    return;
  }

  const docs = snapshot.docs;

  for (let index = 0; index < docs.length; index += BATCH_LIMIT) {
    const chunk = docs.slice(index, index + BATCH_LIMIT);
    const batch = writeBatch(db);
    for (const item of chunk) {
      batch.delete(item.ref);
    }
    await batch.commit();
  }
}

async function deleteUserSubcollections(uid: string): Promise<void> {
  const db = requireFirestore();

  for (const name of USER_SUBCOLLECTIONS) {
    await deleteQueryInBatches(db, `users/${uid}/${name}`);
  }
}

async function deleteUserStorage(uid: string): Promise<void> {
  const storage = getFirebaseStorage();

  if (!storage) {
    return;
  }

  try {
    await deleteObject(ref(storage, profileImageStoragePath(uid)));
  } catch {
    // Profile photo may not exist.
  }

  try {
    const exercisesFolder = ref(storage, `users/${uid}/exercises`);
    const listed = await listAll(exercisesFolder);
    await Promise.all(listed.items.map((item) => deleteObject(item)));
  } catch {
    // Folder may be empty or missing.
  }
}

async function deleteUserDocument(uid: string): Promise<void> {
  const db = requireFirestore();
  await deleteDoc(doc(db, "users", uid));
}

/**
 * Deletes Firestore user data + Storage media for the signed-in owner.
 * Does not delete Auth user or support tickets (tickets are not client-deletable).
 */
export async function deleteUserOwnedData(uid: string): Promise<void> {
  const trimmed = uid.trim();

  if (!trimmed) {
    throw new Error("Missing user id.");
  }

  await deleteUserSubcollections(trimmed);
  await deleteUserStorage(trimmed);
  await deleteUserDocument(trimmed);
}
