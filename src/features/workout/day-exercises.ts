import { useSyncExternalStore } from "react";
import type { ProgramExercise } from "@/features/workout/types";

/** Builder scratchpad exercise — full snapshot fields for Firestore program save. */
export type DayExercise = ProgramExercise;

let exercisesByDay: Record<string, DayExercise[]> = {};
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
  return exercisesByDay;
}

export function getExercisesForDay(dayName: string) {
  return exercisesByDay[dayName] ?? [];
}

export function catalogExerciseId(name: string) {
  return `catalog:${name.trim().toLowerCase().replace(/\s+/g, "-")}`;
}

export function addExerciseToDay(dayName: string, exercise: DayExercise) {
  const existing = exercisesByDay[dayName] ?? [];
  const alreadyAdded = existing.some(
    (item) =>
      item.exerciseId === exercise.exerciseId || item.name === exercise.name,
  );

  if (alreadyAdded) {
    return;
  }

  exercisesByDay = {
    ...exercisesByDay,
    [dayName]: [...existing, exercise],
  };
  emit();
}

export function clearExercisesByDay() {
  exercisesByDay = {};
  emit();
}

export function useExercisesByDay() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useExercisesForDay(dayName: string) {
  const all = useExercisesByDay();
  return all[dayName] ?? [];
}
