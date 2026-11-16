import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { useCallback, useMemo } from "react";
import type { WeekPage, WeekStartsOn } from "./types";

const WEEKS_EACH_SIDE = 52;
const EMPTY_ACTIVITY_DATES: Date[] = [];

export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function buildWeekPages(anchorDate: Date, weekStartsOn: WeekStartsOn): WeekPage[] {
  const baseWeekStart = startOfWeek(anchorDate, { weekStartsOn });

  return Array.from({ length: WEEKS_EACH_SIDE * 2 + 1 }, (_, index) => {
    const weekStart = addWeeks(baseWeekStart, index - WEEKS_EACH_SIDE);
    const days = eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6),
    });

    return {
      key: dateKey(weekStart),
      weekStart,
      days,
    };
  });
}

export function findWeekIndex(weeks: WeekPage[], date: Date): number {
  return weeks.findIndex((week) => week.days.some((day) => isSameDay(day, date)));
}

export function useWeek({
  selectedDate,
  weekStartsOn = 0,
  activityDates = EMPTY_ACTIVITY_DATES,
}: {
  selectedDate: Date;
  weekStartsOn?: WeekStartsOn;
  activityDates?: Date[];
}) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const weeks = useMemo(
    () => buildWeekPages(today, weekStartsOn),
    [today, weekStartsOn],
  );

  const activityKeys = useMemo(
    () => new Set(activityDates.map((date) => dateKey(startOfDay(date)))),
    [activityDates],
  );

  const selectedWeekIndex = useMemo(
    () => findWeekIndex(weeks, selectedDate),
    [weeks, selectedDate],
  );

  const initialWeekIndex = useMemo(() => {
    const todayIndex = findWeekIndex(weeks, today);
    return todayIndex >= 0 ? todayIndex : WEEKS_EACH_SIDE;
  }, [weeks, today]);

  const hasActivity = useCallback(
    (date: Date) => activityKeys.has(dateKey(startOfDay(date))),
    [activityKeys],
  );

  return {
    today,
    weeks,
    selectedWeekIndex,
    initialWeekIndex,
    hasActivity,
  };
}
