import { describe, expect, it } from "vitest";
import {
  collectProgressExercises,
  exercisesForMuscleGroup,
  uniqueMuscleGroups,
} from "@/features/workout/progress-exercises";
import type { CustomExercise, Program, WorkoutSession } from "@/features/workout/types";

const program: Program = {
  id: "prog1",
  name: "Push",
  createdAt: null,
  updatedAt: null,
  days: [
    {
      id: "day_1",
      name: "Day 1",
      order: 0,
      exercises: [
        {
          id: "pe1",
          exerciseId: "catalog:bench",
          name: "Bench Press",
          source: "catalog",
          muscleGroup: "Chest",
          measure: null,
          repType: null,
          dropsetLvls: null,
          supersetExerciseName: null,
          imageUrl: null,
        },
      ],
    },
  ],
};

const custom: CustomExercise = {
  id: "ex_custom",
  name: "JM Press",
  muscleGroup: "Triceps",
  measure: null,
  repType: null,
  dropsetLvls: null,
  supersetExerciseName: null,
  imageUrl: null,
  createdAt: null,
};

const session: WorkoutSession = {
  id: "s1",
  programId: "prog1",
  programName: "Push",
  dayId: "day_1",
  dayName: "Day 1",
  performedAt: Date.now(),
  date: "2026-09-12",
  status: "completed",
  exerciseIds: ["catalog:bench"],
  exercises: [
    {
      exerciseId: "catalog:bench",
      name: "Barbell Bench Press",
      muscleGroup: "Chest",
      sets: [],
      totalVolume: 100,
    },
  ],
};

describe("progress-exercises", () => {
  it("collects unique exercises and muscle groups", () => {
    const exercises = collectProgressExercises({
      programs: [program],
      customExercises: [custom],
      sessions: [session],
    });

    expect(uniqueMuscleGroups(exercises)).toEqual(["Chest", "Triceps"]);
    expect(exercisesForMuscleGroup(exercises, "Chest")).toHaveLength(1);
    expect(exercisesForMuscleGroup(exercises, "Chest")[0]?.name).toBe(
      "Barbell Bench Press",
    );
  });
});
