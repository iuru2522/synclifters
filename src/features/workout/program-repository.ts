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
import type {
  ExerciseSource,
  Program,
  ProgramDay,
  ProgramExercise,
} from "@/features/workout/types";
import type { MeasureOption } from "@/features/workout/custom-exercise-measure";
import type { MuscleGroup } from "@/features/workout/custom-exercise-muscle";
import type { RepType } from "@/features/workout/rep-type-selection";

export type CreateProgramInput = {
  name: string;
  days: Array<{
    name: string;
    exercises: ProgramExercise[];
  }>;
};

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

function programsCollection(uid: string) {
  return collection(requireFirestore(), "users", uid, "programs");
}

function parseSource(value: unknown): ExerciseSource {
  return value === "custom" ? "custom" : "catalog";
}

function parseRepType(value: unknown): RepType | null {
  if (value === "regular" || value === "superset" || value === "dropset") {
    return value;
  }

  return null;
}

function parseProgramExercise(value: unknown, index: number): ProgramExercise | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";

  if (!name) {
    return null;
  }

  const id =
    typeof raw.id === "string" && raw.id.trim()
      ? raw.id.trim()
      : `pe_${index}`;
  const exerciseId =
    typeof raw.exerciseId === "string" && raw.exerciseId.trim()
      ? raw.exerciseId.trim()
      : id;

  return {
    id,
    exerciseId,
    name,
    source: parseSource(raw.source),
    muscleGroup:
      typeof raw.muscleGroup === "string" && raw.muscleGroup.trim()
        ? (raw.muscleGroup as MuscleGroup | string)
        : "Triceps",
    measure:
      typeof raw.measure === "string"
        ? (raw.measure as MeasureOption | string)
        : raw.measure === null
          ? null
          : null,
    repType: parseRepType(raw.repType),
    dropsetLvls:
      typeof raw.dropsetLvls === "number" && Number.isFinite(raw.dropsetLvls)
        ? Math.max(0, Math.floor(raw.dropsetLvls))
        : null,
    supersetExerciseName:
      typeof raw.supersetExerciseName === "string" ? raw.supersetExerciseName : null,
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : null,
  };
}

function parseProgramDay(value: unknown, index: number): ProgramDay | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";

  if (!name) {
    return null;
  }

  const exercisesRaw = Array.isArray(raw.exercises) ? raw.exercises : [];
  const exercises = exercisesRaw
    .map((item, exerciseIndex) => parseProgramExercise(item, exerciseIndex))
    .filter((item): item is ProgramExercise => item != null);

  return {
    id:
      typeof raw.id === "string" && raw.id.trim()
        ? raw.id.trim()
        : `day_${index + 1}`,
    name,
    order:
      typeof raw.order === "number" && Number.isFinite(raw.order)
        ? Math.max(0, Math.floor(raw.order))
        : index,
    exercises,
  };
}

function parseProgram(id: string, data: Record<string, unknown>): Program | null {
  const name = typeof data.name === "string" ? data.name.trim() : "";

  if (!name) {
    return null;
  }

  const daysRaw = Array.isArray(data.days) ? data.days : [];
  const days = daysRaw
    .map((item, index) => parseProgramDay(item, index))
    .filter((item): item is ProgramDay => item != null)
    .sort((a, b) => a.order - b.order);

  return {
    id,
    name,
    createdAt: coerceToMillis(data.createdAt),
    updatedAt: coerceToMillis(data.updatedAt),
    days,
  };
}

function serializeExercise(exercise: ProgramExercise): Record<string, unknown> {
  return {
    id: exercise.id,
    exerciseId: exercise.exerciseId,
    name: exercise.name,
    source: exercise.source,
    muscleGroup: exercise.muscleGroup,
    measure: exercise.measure,
    repType: exercise.repType,
    dropsetLvls: exercise.dropsetLvls,
    supersetExerciseName: exercise.supersetExerciseName,
    imageUrl: exercise.imageUrl,
  };
}

export async function createProgram(
  uid: string,
  input: CreateProgramInput,
): Promise<Program> {
  const trimmedName = input.name.trim();

  if (!trimmedName) {
    throw new Error("Enter a program name.");
  }

  if (input.days.length === 0) {
    throw new Error("Add at least one day before saving.");
  }

  const programRef = doc(programsCollection(uid));
  const days: ProgramDay[] = input.days.map((day, index) => ({
    id: `day_${index + 1}`,
    name: day.name.trim() || `Day ${index + 1}`,
    order: index,
    exercises: day.exercises.map((exercise, exerciseIndex) => ({
      ...exercise,
      id: exercise.id || `pe_${index}_${exerciseIndex}`,
    })),
  }));

  await setDoc(programRef, {
    name: trimmedName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    days: days.map((day) => ({
      id: day.id,
      name: day.name,
      order: day.order,
      exercises: day.exercises.map(serializeExercise),
    })),
  });

  return {
    id: programRef.id,
    name: trimmedName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    days,
  };
}

export async function listPrograms(uid: string): Promise<Program[]> {
  const snapshot = await getDocs(programsCollection(uid));

  return snapshot.docs
    .map((item) => parseProgram(item.id, item.data() as Record<string, unknown>))
    .filter((item): item is Program => item != null)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function getProgram(
  uid: string,
  programId: string,
): Promise<Program | null> {
  const snapshot = await getDoc(doc(programsCollection(uid), programId));

  if (!snapshot.exists()) {
    return null;
  }

  return parseProgram(snapshot.id, snapshot.data() as Record<string, unknown>);
}
