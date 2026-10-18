import { describe, expect, it } from "vitest";
import {
  buildProgressMetricChartModel,
  computePastWeekDelta,
} from "@/features/users/progress-metric-chart";
import type { BodyMetricEntry } from "@/features/users/types";

describe("progress-metric-chart", () => {
  it("returns null model when entries are empty and 0 delta", () => {
    expect(buildProgressMetricChartModel([], "weight")).toBeNull();
    expect(computePastWeekDelta([], "weight")).toEqual({
      direction: "down",
      arrowSymbol: "↓",
      valueText: "0",
      unitLabel: "kgs",
      periodLabel: "past week",
    });
  });

  it("builds flat line and matching 68..92 scale for a single 91.2 kg entry", () => {
    const entries: BodyMetricEntry[] = [
      {
        id: "m1",
        type: "weight",
        value: 91.2,
        unit: "kg",
        recordedAt: Date.UTC(2026, 6, 28, 12, 0, 0),
        source: "progress",
      },
    ];

    const model = buildProgressMetricChartModel(entries, "weight");
    expect(model).not.toBeNull();
    expect(model?.yAxisOffset).toBe(68);
    expect(model?.maxValue).toBe(24);
    expect(model?.stepValue).toBe(4);
    expect(model?.noOfSections).toBe(6);
    expect(model?.points).toHaveLength(3);
    expect(model?.points[0]?.isFirstRealPoint).toBe(true);
    expect(model?.points[1]?.isLastRealPoint).toBe(true);
    expect(model?.points[2]?.isTrailingProjection).toBe(true);
    expect(model?.delta).toEqual({
      direction: "down",
      arrowSymbol: "↓",
      valueText: "0",
      unitLabel: "kgs",
      periodLabel: "past week",
    });
  });

  it("computes past week delta across multiple entries", () => {
    const entries: BodyMetricEntry[] = [
      {
        id: "m2",
        type: "weight",
        value: 89.5,
        unit: "kg",
        recordedAt: Date.UTC(2026, 6, 28, 12, 0, 0),
        source: "progress",
      },
      {
        id: "m1",
        type: "weight",
        value: 91.2,
        unit: "kg",
        recordedAt: Date.UTC(2026, 6, 22, 12, 0, 0),
        source: "progress",
      },
    ];

    const delta = computePastWeekDelta(entries, "weight");
    expect(delta).toEqual({
      direction: "down",
      arrowSymbol: "↓",
      valueText: "1.7",
      unitLabel: "kgs",
      periodLabel: "past week",
    });
  });
});
