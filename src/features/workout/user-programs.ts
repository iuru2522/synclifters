import { useSyncExternalStore } from "react";
import type { DayExercise } from "@/features/workout/day-exercises";

export type UserProgram = {
  id: string;
  name: string;
  dayNames: string[];
  exercisesByDay: Record<string, DayExercise[]>;
};

let programs: UserProgram[] = [];
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
  return programs;
}

export function getUserPrograms() {
  return programs;
}

export function saveUserProgram(input: {
  name: string;
  dayNames: string[];
  exercisesByDay: Record<string, DayExercise[]>;
}) {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    return;
  }

  const exercisesByDay: Record<string, DayExercise[]> = {};
  for (const dayName of input.dayNames) {
    exercisesByDay[dayName] = [...(input.exercisesByDay[dayName] ?? [])];
  }

  programs = [
    ...programs,
    {
      id: `${trimmedName}-${Date.now()}`,
      name: trimmedName,
      dayNames: [...input.dayNames],
      exercisesByDay,
    },
  ];
  emit();
}

export function useUserPrograms() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
