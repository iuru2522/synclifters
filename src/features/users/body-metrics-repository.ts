import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getFirebaseFirestore, getFirebaseSetupMessage } from "@/lib/firebase";
import { coerceToMillis } from "@/lib/firestore-timestamps";
import type {
  BodyMetricEntry,
  BodyMetricSource,
  BodyMetricType,
} from "@/features/users/types";
import {
  updateUserProfile,
  type UserWeightUnit,
} from "@/features/users/user-profile";

export type AppendBodyMetricInput = {
  type: BodyMetricType;
  value: number;
  unit: string;
  source?: BodyMetricSource;
  recordedAt?: Date;
};

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

function bodyMetricsCollection(uid: string) {
  return collection(requireFirestore(), "users", uid, "bodyMetrics");
}

function parseSource(value: unknown): BodyMetricSource {
  return value === "progress" ? "progress" : "profile";
}

function parseBodyMetric(
  id: string,
  data: Record<string, unknown>,
): BodyMetricEntry | null {
  const type =
    data.type === "weight" || data.type === "height" ? data.type : null;
  const value =
    typeof data.value === "number" && Number.isFinite(data.value)
      ? data.value
      : null;

  if (!type || value == null) {
    return null;
  }

  return {
    id,
    type,
    value,
    unit: typeof data.unit === "string" && data.unit.trim() ? data.unit : "",
    recordedAt: coerceToMillis(data.recordedAt),
    source: parseSource(data.source),
  };
}

export function heightUnitForWeightUnit(
  weightUnit: UserWeightUnit | null | undefined,
): "cm" | "in" {
  return weightUnit === "lb" ? "in" : "cm";
}

export async function appendBodyMetric(
  uid: string,
  input: AppendBodyMetricInput,
): Promise<BodyMetricEntry> {
  if (!Number.isFinite(input.value)) {
    throw new Error("Enter a valid measurement.");
  }

  const unit = input.unit.trim();
  if (!unit) {
    throw new Error("Measurement unit is required.");
  }

  const source = input.source ?? "profile";
  const recordedAt = input.recordedAt ?? new Date();
  const ref = await addDoc(bodyMetricsCollection(uid), {
    type: input.type,
    value: input.value,
    unit,
    recordedAt: serverTimestamp(),
    source,
  });

  return {
    id: ref.id,
    type: input.type,
    value: input.value,
    unit,
    recordedAt: recordedAt.getTime(),
    source,
  };
}

export async function listBodyMetrics(
  uid: string,
  type: BodyMetricType,
): Promise<BodyMetricEntry[]> {
  const snapshot = await getDocs(
    query(
      bodyMetricsCollection(uid),
      where("type", "==", type),
      orderBy("recordedAt", "desc"),
    ),
  );

  return snapshot.docs
    .map((item) =>
      parseBodyMetric(item.id, item.data() as Record<string, unknown>),
    )
    .filter((item): item is BodyMetricEntry => item != null);
}

export async function saveWeightWithHistory(
  uid: string,
  weight: number,
  unit: UserWeightUnit,
  source: BodyMetricSource = "profile",
): Promise<void> {
  await updateUserProfile(uid, { weight });
  await appendBodyMetric(uid, {
    type: "weight",
    value: weight,
    unit,
    source,
  });
}

export async function saveHeightWithHistory(
  uid: string,
  height: number,
  weightUnit: UserWeightUnit | null | undefined,
  source: BodyMetricSource = "profile",
): Promise<void> {
  await updateUserProfile(uid, { height });
  await appendBodyMetric(uid, {
    type: "height",
    value: height,
    unit: heightUnitForWeightUnit(weightUnit),
    source,
  });
}
