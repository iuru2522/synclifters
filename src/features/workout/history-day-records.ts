import { useSyncExternalStore } from "react";

export type HistoryDayRecord = {
  id: string;
  name: string;
};

export const HISTORY_DAY_SEED_NAMES = [
  "Tricep Pushdown",
  "Barbell Bench Press",
  "Lat Pulldown",
  "Romanian Deadlift",
  "Shoulder Press",
  "Cable Fly",
] as const;

let recordsByDay: Record<string, HistoryDayRecord[]> = {};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => {
    listener();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return recordsByDay;
}

function dayKey(programName: string, dayName: string) {
  return `${programName}\0${dayName}`;
}

function seedRecords(key: string): HistoryDayRecord[] {
  return HISTORY_DAY_SEED_NAMES.map((name, index) => ({
    id: `${key}-${index}`,
    name,
  }));
}

function ensureDay(programName: string, dayName: string) {
  const key = dayKey(programName, dayName);
  if (recordsByDay[key]) {
    return key;
  }

  recordsByDay = {
    ...recordsByDay,
    [key]: seedRecords(key),
  };
  return key;
}

export function getHistoryDayRecord(
  programName: string,
  dayName: string,
  recordId: string,
) {
  const key = ensureDay(programName, dayName);
  return (recordsByDay[key] ?? []).find((record) => record.id === recordId);
}

export function renameHistoryDayRecord(
  programName: string,
  dayName: string,
  recordId: string,
  name: string,
) {
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }

  const key = ensureDay(programName, dayName);
  const existing = recordsByDay[key] ?? [];
  recordsByDay = {
    ...recordsByDay,
    [key]: existing.map((record) =>
      record.id === recordId ? { ...record, name: trimmed } : record,
    ),
  };
  emit();
}

export function removeHistoryDayRecord(
  programName: string,
  dayName: string,
  recordId: string,
) {
  const key = ensureDay(programName, dayName);
  const existing = recordsByDay[key] ?? [];
  recordsByDay = {
    ...recordsByDay,
    [key]: existing.filter((record) => record.id !== recordId),
  };
  emit();
}

const EMPTY_HISTORY_DAY_RECORDS: HistoryDayRecord[] = [];

export function useHistoryDayRecords(
  programName: string,
  dayName: string,
  enabled: boolean,
) {
  if (enabled) {
    ensureDay(programName, dayName);
  }

  const all = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  if (!enabled) {
    return EMPTY_HISTORY_DAY_RECORDS;
  }

  return all[dayKey(programName, dayName)] ?? EMPTY_HISTORY_DAY_RECORDS;
}
