import type { Href } from "expo-router";

export function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseDayNames(value: string | string[] | undefined): string[] {
  const raw = readSearchParam(value);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
  } catch {
    return [];
  }
}

export function serializeDayNames(dayNames: string[]) {
  return JSON.stringify(dayNames);
}

type ParamValue = string | boolean | null | undefined;
type ParamInput = Record<string, ParamValue>;

function compactParams(params: ParamInput): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === false || value === "") {
      continue;
    }
    out[key] = value === true ? "1" : value;
  }
  return out;
}

function href(pathname: string, params?: ParamInput): Href {
  const compacted = compactParams(params ?? {});
  if (Object.keys(compacted).length === 0) {
    return pathname as Href;
  }
  return { pathname, params: compacted } as Href;
}

export type WorkoutNavParams = {
  programId?: string | null;
  programName?: string | null;
  dayName?: string | null;
  dayNames?: string | null;
  exerciseId?: string | null;
  exerciseName?: string | null;
  muscleGroup?: string | null;
  sessionId?: string | null;
  showEdit?: boolean;
  selectDay?: boolean;
  fromHistory?: boolean;
  performedAt?: string | number | null;
  durationMs?: string | number | null;
};

function asParams(input: WorkoutNavParams): ParamInput {
  return {
    programId: input.programId,
    programName: input.programName,
    dayName: input.dayName,
    dayNames: input.dayNames,
    exerciseId: input.exerciseId,
    exerciseName: input.exerciseName,
    muscleGroup: input.muscleGroup,
    sessionId: input.sessionId,
    showEdit: input.showEdit,
    selectDay: input.selectDay,
    fromHistory: input.fromHistory,
    performedAt:
      input.performedAt != null && input.performedAt !== ""
        ? String(input.performedAt)
        : undefined,
    durationMs:
      input.durationMs != null && input.durationMs !== ""
        ? String(input.durationMs)
        : undefined,
  };
}

export const WORKOUT_HOME_HREF = "/workout" as Href;
export const PROGRESS_METRIC_DETAIL_PATH = "/progress/progress-metric-detail";

export function workoutHomeHref(input: WorkoutNavParams = {}): Href {
  return href("/workout", asParams(input));
}

export function programDayHref(input: WorkoutNavParams): Href {
  return href("/workout/program-day", asParams(input));
}

export function programDayExerciseHref(input: WorkoutNavParams): Href {
  return href("/workout/program-day-exercise", asParams(input));
}

export function workoutScreenHref(input: WorkoutNavParams = {}): Href {
  return href("/workout/workout-screen", asParams(input));
}

export function setScreenHref(input: WorkoutNavParams = {}): Href {
  return href("/workout/set-screen", asParams(input));
}

export function dropSetEntryHref(input: WorkoutNavParams = {}): Href {
  return href("/workout/drop-set-entry", asParams(input));
}

export function exerciseHistoryHref(input: {
  exerciseId: string;
  exerciseName: string;
}): Href {
  return href("/workout/exercise-history", {
    exerciseId: input.exerciseId,
    exerciseName: input.exerciseName,
  });
}

export function addExerciseHref(input: WorkoutNavParams): Href {
  return href("/workout/add-exercise", asParams(input));
}

export function addExerciseToDayHref(input: WorkoutNavParams = {}): Href {
  return href("/workout/add-exercise-to-day", asParams(input));
}

export function createDayHref(input: WorkoutNavParams = {}): Href {
  return href("/workout/create-day", asParams(input));
}

export function createDaySheetHref(input: WorkoutNavParams = {}): Href {
  return href("/workout/create-day-sheet", asParams(input));
}

export function doExerciseHref(input: WorkoutNavParams): Href {
  return href("/workout/do-exercise", asParams(input));
}

export function customExerciseHref(input: WorkoutNavParams = {}): Href {
  return href("/workout/custom-exercise", asParams(input));
}

export function exercisePickerHref(input: WorkoutNavParams): Href {
  return href("/workout/exercise", asParams(input));
}

export function progressMetricDetailHref(input: {
  exerciseId: string;
  exerciseName: string;
}): Href {
  return href(PROGRESS_METRIC_DETAIL_PATH, {
    exerciseId: input.exerciseId,
    exerciseName: input.exerciseName,
  });
}
