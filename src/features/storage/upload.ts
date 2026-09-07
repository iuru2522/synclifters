import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseSetupMessage, getFirebaseStorage } from "@/lib/firebase";

function requireStorage() {
  const storage = getFirebaseStorage();

  if (!storage) {
    throw new Error(getFirebaseSetupMessage());
  }

  return storage;
}

/**
 * Upload a local image URI (picker/camera) to Firebase Storage and return its download URL.
 */
export async function uploadImageFromUri(input: {
  path: string;
  uri: string;
  contentType?: string;
}): Promise<string> {
  const storage = requireStorage();
  const response = await fetch(input.uri);
  const blob = await response.blob();
  const contentType =
    input.contentType ?? (blob.type.startsWith("image/") ? blob.type : "image/jpeg");
  const storageRef = ref(storage, input.path);

  await uploadBytes(storageRef, blob, { contentType });
  return getDownloadURL(storageRef);
}

export function exerciseImageStoragePath(uid: string, exerciseId: string) {
  return `users/${uid}/exercises/${exerciseId}.jpg`;
}

export function profileImageStoragePath(uid: string) {
  return `users/${uid}/profile.jpg`;
}
