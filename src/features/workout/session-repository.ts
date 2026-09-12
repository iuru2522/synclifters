import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getFirebaseFirestore, getFirebaseSetupMessage } from "@/lib/firebase";
import { coerceToMillis, toDateKey } from "@/lib/firestore-timestamps";
import { catalogExerciseId } from "@/features/workout/day-exercises";
import type { RecordedDropSet } from "@/features/workout/recorded-drop-sets";
import type { RecordedWorkingSet } from "@/features/workout/recorded-working-sets";
import type {
  ActivityDay,
  SessionExercise,
  SessionSet,
  SetFeeling,
  WorkoutSession,
} from "@/features/workout/types";

export type CreateCompletedSessionInput = {
  programId?: string | null;
  programName: string;
  dayId?: string | null;
  dayName: string;
  exerciseId?: string | null;
  exerciseName: string;
  muscleGroup?: string | null;
  workingSets: RecordedWorkingSet[];
  dropSets: RecordedDropSet[];
  performedAt?: Date;
};

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

function sessionsCollection(uid: string) {
  return collection(requireFirestore(), "users", uid, "sessions");
}

function activityCollection(uid: string) {
  return collection(requireFirestore(), "users", uid, "activity");
}

function parseFeeling(value: unknown): SetFeeling | null {
  if (
    value === "W" ||
    value === "EASY" ||
    value === "GOOD" ||
    value === "HARD" ||
    value === "LIMIT"
  ) {
    return value;
  }

  return null;
}

function parseNumberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseSet(value: unknown): SessionSet | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const kind = raw.kind === "drop" ? "drop" : raw.kind === "working" ? "working" : null;

  if (!kind) {
    return null;
  }

  return {
    kind,
    weight: parseNumberOrNull(raw.weight),
    reps: parseNumberOrNull(raw.reps),
    feeling: parseFeeling(raw.feeling),
  };
}

function parseSessionExercise(value: unknown): SessionExercise | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";

  if (!name) {
    return null;
  }

  const setsRaw = Array.isArray(raw.sets) ? raw.sets : [];
  const sets = setsRaw
    .map((item) => parseSet(item))
    .filter((item): item is SessionSet => item != null);

  return {
    exerciseId:
      typeof raw.exerciseId === "string" && raw.exerciseId.trim()
        ? raw.exerciseId.trim()
        : catalogExerciseId(name),
    name,
    muscleGroup: typeof raw.muscleGroup === "string" ? raw.muscleGroup : null,
    sets,
    totalVolume: parseNumberOrNull(raw.totalVolume),
  };
}

export function parseSession(id: string, data: Record<string, unknown>): WorkoutSession | null {
  const programName =
    typeof data.programName === "string" ? data.programName.trim() : "";
  const dayName = typeof data.dayName === "string" ? data.dayName.trim() : "";

  if (!programName || !dayName) {
    return null;
  }

  const exercisesRaw = Array.isArray(data.exercises) ? data.exercises : [];
  const exercises = exercisesRaw
    .map((item) => parseSessionExercise(item))
    .filter((item): item is SessionExercise => item != null);

  const exerciseIds = Array.isArray(data.exerciseIds)
    ? data.exerciseIds.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      )
    : exercises.map((item) => item.exerciseId);

  return {
    id,
    programId: typeof data.programId === "string" ? data.programId : null,
    programName,
    dayId: typeof data.dayId === "string" ? data.dayId : null,
    dayName,
    performedAt: coerceToMillis(data.performedAt),
    date: typeof data.date === "string" ? data.date : "",
    status: data.status === "in_progress" ? "in_progress" : "completed",
    exerciseIds,
    exercises,
  };
}

function parseActivityDay(id: string, data: Record<string, unknown>): ActivityDay | null {
  const date =
    typeof data.date === "string" && data.date.trim() ? data.date.trim() : id.trim();

  if (!date) {
    return null;
  }

  const sessionCount = parseNumberOrNull(data.sessionCount);

  return {
    date,
    sessionCount: sessionCount != null ? Math.max(0, Math.floor(sessionCount)) : 0,
  };
}

function serializeSet(set: SessionSet): Record<string, unknown> {
  return {
    kind: set.kind,
    weight: set.weight,
    reps: set.reps,
    feeling: set.feeling,
  };
}

function buildSetsFromRecords(
  workingSets: RecordedWorkingSet[],
  dropSets: RecordedDropSet[],
): SessionSet[] {
  const working: SessionSet[] = workingSets.map((set) => ({
    kind: "working",
    weight: parseNumberOrNull(set.weight),
    reps: parseNumberOrNull(set.reps),
    feeling: set.feeling,
  }));

  const drops: SessionSet[] = dropSets.map((set) => ({
    kind: "drop",
    weight: parseNumberOrNull(set.weight),
    reps: parseNumberOrNull(set.reps),
    feeling: set.feeling,
  }));

  return [...working, ...drops];
}

function totalVolumeForSets(sets: SessionSet[]): number | null {
  let total = 0;
  let hasValue = false;

  for (const set of sets) {
    if (set.weight == null || set.reps == null) {
      continue;
    }

    total += set.weight * set.reps;
    hasValue = true;
  }

  return hasValue ? total : null;
}

function dayIdFromDayName(dayName: string): string | null {
  const match = /^Day\s+(\d+)$/i.exec(dayName.trim());
  if (!match) {
    return null;
  }

  return `day_${match[1]}`;
}

export async function createCompletedSession(
  uid: string,
  input: CreateCompletedSessionInput,
): Promise<WorkoutSession> {
  const programName = input.programName.trim();
  const dayName = input.dayName.trim();
  const exerciseName = input.exerciseName.trim();

  if (!programName) {
    throw new Error("Program name is required to save a workout.");
  }

  if (!dayName) {
    throw new Error("Day name is required to save a workout.");
  }

  if (!exerciseName) {
    throw new Error("Exercise name is required to save a workout.");
  }

  const sets = buildSetsFromRecords(input.workingSets, input.dropSets);

  if (sets.length === 0) {
    throw new Error("Record at least one set before finishing.");
  }

  const performedAt = input.performedAt ?? new Date();
  const dateKey = toDateKey(performedAt);
  const exerciseId =
    input.exerciseId?.trim() || catalogExerciseId(exerciseName);
  const exercise: SessionExercise = {
    exerciseId,
    name: exerciseName,
    muscleGroup: input.muscleGroup ?? null,
    sets,
    totalVolume: totalVolumeForSets(sets),
  };

  const db = requireFirestore();
  const sessionRef = doc(sessionsCollection(uid));
  const activityRef = doc(db, "users", uid, "activity", dateKey);
  const userRef = doc(db, "users", uid);
  const dayId = input.dayId ?? dayIdFromDayName(dayName);
  const programId = input.programId ?? null;

  const payload = {
    programId,
    programName,
    dayId,
    dayName,
    performedAt: serverTimestamp(),
    date: dateKey,
    status: "completed" as const,
    exerciseIds: [exerciseId],
    exercises: [
      {
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets.map(serializeSet),
        totalVolume: exercise.totalVolume,
      },
    ],
  };

  await runTransaction(db, async (tx) => {
    const activitySnap = await tx.get(activityRef);
    const userSnap = await tx.get(userRef);

    tx.set(sessionRef, payload);

    if (activitySnap.exists()) {
      const currentCount = parseNumberOrNull(activitySnap.data().sessionCount) ?? 0;
      tx.set(
        activityRef,
        {
          date: dateKey,
          sessionCount: Math.max(0, Math.floor(currentCount)) + 1,
        },
        { merge: true },
      );
      return;
    }

    tx.set(activityRef, {
      date: dateKey,
      sessionCount: 1,
    });

    const stats = userSnap.exists() ? userSnap.data().stats : null;
    const currentTrainingDays =
      stats && typeof stats === "object"
        ? parseNumberOrNull((stats as { trainingDaysCount?: unknown }).trainingDaysCount)
        : null;

    tx.set(
      userRef,
      {
        stats: {
          trainingDaysCount: Math.max(0, Math.floor(currentTrainingDays ?? 0)) + 1,
        },
      },
      { merge: true },
    );
  });

  return {
    id: sessionRef.id,
    programId,
    programName,
    dayId,
    dayName,
    performedAt: performedAt.getTime(),
    date: dateKey,
    status: "completed",
    exerciseIds: [exerciseId],
    exercises: [exercise],
  };
}

export async function listSessions(uid: string): Promise<WorkoutSession[]> {
  const snapshot = await getDocs(
    query(sessionsCollection(uid), orderBy("performedAt", "desc")),
  );

  return snapshot.docs
    .map((item) => parseSession(item.id, item.data() as Record<string, unknown>))
    .filter((item): item is WorkoutSession => item != null);
}

export async function getSession(
  uid: string,
  sessionId: string,
): Promise<WorkoutSession | null> {
  const snapshot = await getDoc(doc(sessionsCollection(uid), sessionId));

  if (!snapshot.exists()) {
    return null;
  }

  return parseSession(snapshot.id, snapshot.data() as Record<string, unknown>);
}

export async function listSessionsForExercise(
  uid: string,
  exerciseId: string,
): Promise<WorkoutSession[]> {
  const trimmed = exerciseId.trim();
  if (!trimmed) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      sessionsCollection(uid),
      where("exerciseIds", "array-contains", trimmed),
      orderBy("performedAt", "desc"),
    ),
  );

  return snapshot.docs
    .map((item) => parseSession(item.id, item.data() as Record<string, unknown>))
    .filter((item): item is WorkoutSession => item != null);
}

export async function listActivityDays(uid: string): Promise<ActivityDay[]> {
  const snapshot = await getDocs(activityCollection(uid));

  return snapshot.docs
    .map((item) => parseActivityDay(item.id, item.data() as Record<string, unknown>))
    .filter((item): item is ActivityDay => item != null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function activityDaysToDates(days: ActivityDay[]): Date[] {
  return days
    .map((day) => {
      const [year, month, date] = day.date.split("-").map(Number);
      if (!year || !month || !date) {
        return null;
      }

      return new Date(year, month - 1, date);
    })
    .filter((item): item is Date => item != null);
}
