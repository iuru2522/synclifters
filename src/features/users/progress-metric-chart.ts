import type { BodyMetricEntry, BodyMetricType } from "@/features/users/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;
const MAX_PLOTTED_ENTRIES = 8;
const DEFAULT_SECTIONS = 6;
const DEFAULT_STEP_VALUE = 4;

export type MetricDeltaSummary = {
  direction: "up" | "down";
  arrowSymbol: "↑" | "↓";
  valueText: string;
  unitLabel: string;
  periodLabel: string;
};

export type ProgressMetricChartPoint = {
  value: number;
  displayValue: string;
  label: string;
  isFirstRealPoint: boolean;
  isLastRealPoint: boolean;
  isTrailingProjection: boolean;
};

export type ProgressMetricChartModel = {
  points: ProgressMetricChartPoint[];
  lastRealIndex: number;
  yAxisOffset: number;
  maxValue: number;
  stepValue: number;
  noOfSections: number;
  baselinePosition: number;
  xAxisLabels: [string, string, string];
  delta: MetricDeltaSummary;
};

export function formatChartMetricNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatShortChartDate(recordedAt: number | null): string {
  if (recordedAt == null || !Number.isFinite(recordedAt)) {
    return "";
  }

  return new Date(recordedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDeltaUnitLabel(
  unit: string | undefined,
  metric: BodyMetricType,
): string {
  const normalized = (unit ?? "").trim().toLowerCase();

  if (normalized === "kg" || normalized === "kgs") {
    return "kgs";
  }

  if (normalized === "lb" || normalized === "lbs") {
    return "lbs";
  }

  if (normalized === "cm" || normalized === "in") {
    return normalized;
  }

  return metric === "height" ? "cm" : "kgs";
}

export function sortEntriesChronologically(
  entries: BodyMetricEntry[],
): BodyMetricEntry[] {
  return [...entries]
    .filter((entry) => Number.isFinite(entry.value))
    .sort((a, b) => (a.recordedAt ?? 0) - (b.recordedAt ?? 0));
}

export function computePastWeekDelta(
  entries: BodyMetricEntry[],
  metric: BodyMetricType,
): MetricDeltaSummary {
  const chronological = sortEntriesChronologically(entries);
  const latest = chronological[chronological.length - 1];
  const unitLabel = formatDeltaUnitLabel(latest?.unit, metric);

  if (chronological.length < 2 || !latest) {
    return {
      direction: "down",
      arrowSymbol: "↓",
      valueText: "0",
      unitLabel,
      periodLabel: "past week",
    };
  }

  let baseline = chronological[chronological.length - 2];

  if (latest.recordedAt != null) {
    const weekAgo = latest.recordedAt - MS_PER_WEEK;
    const withinWeek = chronological.filter(
      (item) => item.recordedAt != null && item.recordedAt >= weekAgo,
    );

    if (withinWeek.length >= 2) {
      baseline = withinWeek[0];
    } else {
      const beforeWeek = chronological.filter(
        (item) => item.recordedAt != null && item.recordedAt < weekAgo,
      );
      if (beforeWeek.length > 0) {
        baseline = beforeWeek[beforeWeek.length - 1];
      }
    }
  }

  const rawDelta = Math.round((latest.value - baseline.value) * 10) / 10;
  const direction = rawDelta > 0 ? "up" : "down";

  return {
    direction,
    arrowSymbol: direction === "up" ? "↑" : "↓",
    valueText: formatChartMetricNumber(Math.abs(rawDelta)),
    unitLabel,
    periodLabel: "past week",
  };
}

export function buildProgressMetricChartModel(
  entries: BodyMetricEntry[],
  metric: BodyMetricType,
): ProgressMetricChartModel | null {
  const chronological = sortEntriesChronologically(entries);
  if (chronological.length === 0) {
    return null;
  }

  const recent = chronological.slice(-MAX_PLOTTED_ENTRIES);
  const realEntries =
    recent.length === 1 ? [recent[0], recent[0]] : recent;

  const values = realEntries.map((item) => item.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  const noOfSections = DEFAULT_SECTIONS;
  const rawSpan = Math.max(0, maxVal - minVal);
  const stepValue =
    rawSpan <= 16
      ? DEFAULT_STEP_VALUE
      : Math.max(
          DEFAULT_STEP_VALUE,
          Math.ceil((rawSpan + 8) / noOfSections / 2) * 2,
        );

  const totalRange = stepValue * noOfSections;
  const yMax = Math.ceil((maxVal + 0.8) / 2) * 2;
  const yAxisOffset = Math.max(0, yMax - totalRange);
  const maxValue = totalRange;
  const baselinePosition = Math.round(yAxisOffset + stepValue * 0.5);

  const lastRealIndex = realEntries.length - 1;
  const middleIndex =
    realEntries.length >= 3 ? Math.floor(lastRealIndex / 2) : -1;

  const points: ProgressMetricChartPoint[] = realEntries.map((entry, index) => {
    const shouldLabel =
      index === 0 || index === middleIndex || index === lastRealIndex;

    return {
      value: entry.value,
      displayValue: formatChartMetricNumber(entry.value),
      label: shouldLabel ? formatShortChartDate(entry.recordedAt) : "",
      isFirstRealPoint: index === 0,
      isLastRealPoint: index === lastRealIndex,
      isTrailingProjection: false,
    };
  });

  const lastEntry = realEntries[lastRealIndex];
  points.push({
    value: lastEntry.value,
    displayValue: formatChartMetricNumber(lastEntry.value),
    label: "",
    isFirstRealPoint: false,
    isLastRealPoint: false,
    isTrailingProjection: true,
  });

  let xAxisLabels: [string, string, string] = ["", "", ""];
  if (recent.length === 1) {
    const endAt = recent[0]?.recordedAt ?? null;
    if (endAt != null && Number.isFinite(endAt)) {
      xAxisLabels = [
        formatShortChartDate(endAt - 8 * MS_PER_DAY),
        formatShortChartDate(endAt - 4 * MS_PER_DAY),
        formatShortChartDate(endAt),
      ];
    }
  } else {
    const firstAt = recent[0]?.recordedAt ?? null;
    const endAt = recent[recent.length - 1]?.recordedAt ?? null;
    const midAt =
      firstAt != null && endAt != null
        ? Math.round((firstAt + endAt) / 2)
        : (recent[Math.floor(recent.length / 2)]?.recordedAt ?? null);
    xAxisLabels = [
      formatShortChartDate(firstAt),
      formatShortChartDate(midAt),
      formatShortChartDate(endAt),
    ];
  }

  return {
    points,
    lastRealIndex,
    yAxisOffset,
    maxValue,
    stepValue,
    noOfSections,
    baselinePosition,
    xAxisLabels,
    delta: computePastWeekDelta(chronological, metric),
  };
}
