import { describe, expect, it } from "vitest";
import { parseBodyMetric } from "@/features/users/body-metrics-repository";
import { parseCustomExercise } from "@/features/workout/exercise-repository";
import { parseProgram } from "@/features/workout/program-repository";
import {
  findSessionExercise,
  formatSetsSummary,
  formatVolumeLabel,
} from "@/features/workout/session-display";
import { parseSession } from "@/features/workout/session-repository";

describe("parseSession", () => {
  it("maps a Firestore session document", () => {
    const session = parseSession("s1", {
      programName: "Push Pull",
      dayName: "Day 1",
      performedAt: 1_700_000_000_000,
      date: "2026-09-12",
      status: "completed",
      exerciseIds: ["catalog:bench"],
      exercises: [
        {
          exerciseId: "catalog:bench",
          name: "Bench Press",
          muscleGroup: "Chest",
          sets: [{ kind: "working", weight: 60, reps: 8, feeling: "GOOD" }],
          totalVolume: 480,
        },
      ],
    });

    expect(session).not.toBeNull();
    expect(session?.id).toBe("s1");
    expect(session?.exercises[0]?.totalVolume).toBe(480);
    expect(findSessionExercise(session!, "catalog:bench")?.name).toBe(
      "Bench Press",
    );
    expect(
      formatSetsSummary(session!.exercises[0]!.sets),
    ).toBe("60X8");
    expect(formatVolumeLabel(480)).toBe("480 Kgs");
  });

  it("returns null when required fields are missing", () => {
    expect(parseSession("s1", { programName: "Push" })).toBeNull();
  });
});

describe("parseProgram", () => {
  it("maps nested days and exercises", () => {
    const program = parseProgram("p1", {
      name: "Full Body",
      createdAt: 1_700_000_000_000,
      updatedAt: 1_700_000_000_100,
      days: [
        {
          id: "day_1",
          name: "Day 1",
          order: 0,
          exercises: [
            {
              id: "pe1",
              exerciseId: "catalog:squat",
              name: "Squat",
              source: "catalog",
              muscleGroup: "Back",
            },
          ],
        },
      ],
    });

    expect(program?.name).toBe("Full Body");
    expect(program?.days[0]?.exercises[0]?.exerciseId).toBe("catalog:squat");
  });
});

describe("parseBodyMetric / parseCustomExercise", () => {
  it("maps body metric entries", () => {
    const entry = parseBodyMetric("m1", {
      type: "weight",
      value: 72.5,
      unit: "kg",
      recordedAt: 1_700_000_000_000,
      source: "progress",
    });
    expect(entry).toMatchObject({
      id: "m1",
      type: "weight",
      value: 72.5,
      unit: "kg",
      source: "progress",
    });
  });

  it("maps custom exercises and defaults muscle group", () => {
    const exercise = parseCustomExercise("ex1", {
      name: "JM Press",
      createdAt: 1_700_000_000_000,
    });
    expect(exercise?.muscleGroup).toBe("Triceps");
    expect(parseCustomExercise("ex2", { name: "  " })).toBeNull();
  });
});
