import { Timestamp } from "firebase/firestore";

/** Domain-facing instant (ms since epoch). Prefer this over raw Firestore Timestamp in app code. */
export type EpochMillis = number;

export function isFirestoreTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}

export function timestampToMillis(value: Timestamp | null | undefined): EpochMillis | null {
  if (!value) {
    return null;
  }

  return value.toMillis();
}

export function timestampToDate(value: Timestamp | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return value.toDate();
}

export function millisToTimestamp(value: EpochMillis): Timestamp {
  return Timestamp.fromMillis(value);
}

export function dateToTimestamp(value: Date): Timestamp {
  return Timestamp.fromDate(value);
}

/**
 * Accepts Firestore Timestamp, Date, epoch millis, or nullish.
 * Returns epoch millis or null — never throws on unexpected shapes.
 */
export function coerceToMillis(value: unknown): EpochMillis | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getTime();
  }

  if (isFirestoreTimestamp(value)) {
    return value.toMillis();
  }

  return null;
}

/** Calendar day key `yyyy-mm-dd` in local time (for activity docs). */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
