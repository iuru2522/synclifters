import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
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
  days: {
    name: string;
    exercises: ProgramExercise[];
  }[];
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

export function parseProgram(id: string, data: Record<string, unknown>): Program | null {
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
    isFavorite: data.isFavorite === true,
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

function sortPrograms(programs: Program[]): Program[] {
  return [...programs].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    return (b.createdAt ?? 0) - (a.createdAt ?? 0);
  });
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
    isFavorite: false,
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
    isFavorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    days,
  };
}

export async function setProgramFavorite(
  uid: string,
  programId: string,
  isFavorite: boolean,
): Promise<void> {
  const trimmedId = programId.trim();
  if (!trimmedId) {
    throw new Error("Missing program.");
  }

  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  const targetRef = doc(programsCollection(uid), trimmedId);

  if (!isFavorite) {
    await updateDoc(targetRef, {
      isFavorite: false,
      updatedAt: serverTimestamp(),
    });
    return;
  }

  const snapshot = await getDocs(programsCollection(uid));
  const batch = writeBatch(db);

  for (const item of snapshot.docs) {
    const currentlyFavorite = item.data().isFavorite === true;
    if (item.id === trimmedId) {
      batch.update(item.ref, {
        isFavorite: true,
        updatedAt: serverTimestamp(),
      });
      continue;
    }

    if (currentlyFavorite) {
      batch.update(item.ref, {
        isFavorite: false,
        updatedAt: serverTimestamp(),
      });
    }
  }

  await batch.commit();
}

export async function listPrograms(uid: string): Promise<Program[]> {
  const snapshot = await getDocs(programsCollection(uid));

  return sortPrograms(
    snapshot.docs
      .map((item) => parseProgram(item.id, item.data() as Record<string, unknown>))
      .filter((item): item is Program => item != null),
  );
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

export async function addExerciseToProgramDay(
  uid: string,
  programId: string,
  dayName: string,
  exercise: ProgramExercise,
): Promise<Program> {
  const trimmedProgramId = programId.trim();
  const trimmedDayName = dayName.trim();

  if (!trimmedProgramId) {
    throw new Error("Missing program.");
  }

  if (!trimmedDayName) {
    throw new Error("Missing day.");
  }

  const program = await getProgram(uid, trimmedProgramId);
  if (!program) {
    throw new Error("Program not found.");
  }

  const dayIndex = program.days.findIndex(
    (day) => day.name.trim().toLowerCase() === trimmedDayName.toLowerCase(),
  );

  if (dayIndex < 0) {
    throw new Error("Day not found on this program.");
  }

  const day = program.days[dayIndex]!;
  const alreadyAdded = day.exercises.some(
    (item) =>
      item.exerciseId === exercise.exerciseId || item.name === exercise.name,
  );

  if (alreadyAdded) {
    return program;
  }

  const nextExercise: ProgramExercise = {
    ...exercise,
    id: exercise.id || `pe_${Date.now()}`,
  };

  const nextDays = program.days.map((item, index) =>
    index === dayIndex
      ? { ...item, exercises: [...item.exercises, nextExercise] }
      : item,
  );

  await updateDoc(doc(programsCollection(uid), trimmedProgramId), {
    days: nextDays.map((item) => ({
      id: item.id,
      name: item.name,
      order: item.order,
      exercises: item.exercises.map(serializeExercise),
    })),
    updatedAt: serverTimestamp(),
  });

  return {
    ...program,
    updatedAt: Date.now(),
    days: nextDays,
  };
}
