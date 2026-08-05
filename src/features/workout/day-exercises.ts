import { useSyncExternalStore } from "react";

export type DayExercise = {
  id: string;
  name: string;
};

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

export function addExerciseToDay(dayName: string, exerciseName: string) {
  const existing = exercisesByDay[dayName] ?? [];
  const alreadyAdded = existing.some((exercise) => exercise.name === exerciseName);
  if (alreadyAdded) {
    return;
  }

  exercisesByDay = {
    ...exercisesByDay,
    [dayName]: [
      ...existing,
      {
        id: `${dayName}-${exerciseName}-${existing.length}`,
        name: exerciseName,
      },
    ],
  };
  emit();
}

export function useExercisesByDay() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useExercisesForDay(dayName: string) {
  const all = useExercisesByDay();
  return all[dayName] ?? [];
}
