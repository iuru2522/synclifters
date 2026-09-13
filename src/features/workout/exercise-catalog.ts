import catalogSeed from "@/features/workout/exercise-catalog.json";
import { catalogExerciseId } from "@/features/workout/day-exercises";

export const MUSCLE_GROUP_OPTIONS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Abs",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Full Body",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUP_OPTIONS)[number];

export type CatalogExercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
};

type CatalogSeedItem = {
  name: string;
  muscleGroup: string;
};

function isMuscleGroup(value: string): value is MuscleGroup {
  return (MUSCLE_GROUP_OPTIONS as readonly string[]).includes(value);
}

export const CATALOG_EXERCISES: CatalogExercise[] = (
  catalogSeed as CatalogSeedItem[]
).flatMap((item) => {
  const name = item.name.trim();
  if (!name || !isMuscleGroup(item.muscleGroup)) {
    return [];
  }

  return [
    {
      id: catalogExerciseId(name),
      name,
      muscleGroup: item.muscleGroup,
    },
  ];
});

export function catalogExercisesForMuscle(muscleGroup: string): CatalogExercise[] {
  const trimmed = muscleGroup.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  return CATALOG_EXERCISES.filter(
    (exercise) => exercise.muscleGroup.toLowerCase() === trimmed,
  );
}

export function catalogExerciseNames(): string[] {
  return CATALOG_EXERCISES.map((exercise) => exercise.name);
}

export function findCatalogExerciseByName(name: string): CatalogExercise | null {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  return (
    CATALOG_EXERCISES.find((exercise) => exercise.name.toLowerCase() === trimmed) ??
    null
  );
}
