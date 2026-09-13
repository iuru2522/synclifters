import {
  collection,
  getDocs,
  query,
  where,
  type Firestore,
} from "firebase/firestore";
import {
  catalogExercisesForMuscle,
  type CatalogExercise,
  type MuscleGroup,
} from "@/features/workout/exercise-catalog";
import { getFirebaseFirestore } from "@/lib/firebase";

function catalogCollection(db: Firestore) {
  return collection(db, "catalogExercises");
}

function parseCatalogExercise(
  id: string,
  data: Record<string, unknown>,
): CatalogExercise | null {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const muscleGroup =
    typeof data.muscleGroup === "string" ? data.muscleGroup.trim() : "";

  if (!name || !muscleGroup) {
    return null;
  }

  return {
    id: id || (typeof data.id === "string" ? data.id : ""),
    name,
    muscleGroup: muscleGroup as MuscleGroup,
  };
}

export async function listCatalogExercisesForMuscle(
  muscleGroup: string,
): Promise<CatalogExercise[]> {
  const trimmed = muscleGroup.trim();
  if (!trimmed) {
    return [];
  }

  const db = getFirebaseFirestore();
  if (!db) {
    return catalogExercisesForMuscle(trimmed);
  }

  try {
    const snapshot = await getDocs(
      query(catalogCollection(db), where("muscleGroup", "==", trimmed)),
    );

    const fromDb = snapshot.docs
      .map((item) =>
        parseCatalogExercise(item.id, item.data() as Record<string, unknown>),
      )
      .filter((item): item is CatalogExercise => item != null)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (fromDb.length > 0) {
      return fromDb;
    }
  } catch {
    return catalogExercisesForMuscle(trimmed);
  }

  return catalogExercisesForMuscle(trimmed);
}
