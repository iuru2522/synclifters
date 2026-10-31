import { useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import {
  LineChart,
  yAxisSides,
  type lineDataItem,
} from "react-native-gifted-charts";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import {
  buildProgressMetricChartModel,
  computePastWeekDelta,
} from "@/features/users/progress-metric-chart";
import { useUserBodyMetrics } from "@/features/users/user-body-metrics";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const WEIGHT_SHEET_HREF = "/weight-sheet?source=workout" as Href;
const WEIGHT_SCREEN_HREF = "/progress/progress-metric" as Href;

function buildCompactChartData(
  chartModel: NonNullable<ReturnType<typeof buildProgressMetricChartModel>>,
): {
  items: lineDataItem[];
  lastRealPointIndex: number;
  lastDisplayValue: string;
  lastValue: number;
} {
  "use no memo";
  const realPoints = chartModel.points.filter((point) => !point.isTrailingProjection);
  const lastRealPoint = realPoints[realPoints.length - 1];
  const trailingPoint =
    chartModel.points.find((point) => point.isTrailingProjection) ??
    lastRealPoint;

  const items: lineDataItem[] = realPoints.map((point) => ({
    value: point.value,
    label: "",
    hideDataPoint: false,
    dataPointRadius: sizes.workoutWeightTrendDotRadius,
    dataPointColor: colors.backArrow,
  }));

  items.push({
    value: trailingPoint.value,
    label: "",
    hideDataPoint: true,
  });

  return {
    items,
    lastRealPointIndex: realPoints.length - 1,
    lastDisplayValue: lastRealPoint?.displayValue ?? "",
    lastValue: lastRealPoint?.value ?? trailingPoint.value,
  };
}

export function WorkoutWeightTrendChart() {
  "use no memo";
  const router = useRouter();
  const { entries, isLoading, refresh } = useUserBodyMetrics("weight");
  const [bodyWidth, setBodyWidth] = useState(320);

  useRefreshOnFocus(refresh);

  const chartModel = useMemo(
    () => buildProgressMetricChartModel(entries, "weight"),
    [entries],
  );
  const deltaSummary = useMemo(
    () => chartModel?.delta ?? computePastWeekDelta(entries, "weight"),
    [chartModel, entries],
  );

  const chartWidth = Math.max(
    160,
    bodyWidth - sizes.workoutWeightTrendYAxisLabelWidth,
  );

  const mutableChart = chartModel ? buildCompactChartData(chartModel) : null;
  const lineData = mutableChart ? mutableChart.items : [];
  const lastRealPointIndex = mutableChart
    ? mutableChart.lastRealPointIndex
    : chartModel?.lastRealIndex ?? 0;

  function valueBottomOffset(val: number) {
    if (!chartModel || chartModel.maxValue <= 0) {
      return 0;
    }
    const ratio = Math.min(
      1,
      Math.max(0, (val - chartModel.yAxisOffset) / chartModel.maxValue),
    );
    return Math.round(ratio * sizes.workoutWeightTrendPlotHeight) - 6;
  }

  const pointSpacing = useMemo(() => {
    const segments = Math.max(2, (chartModel?.points.length ?? 2) - 1);
    const usableWidth =
      chartWidth -
      spacing.workoutWeightTrendInitialSpacing -
      spacing.workoutWeightTrendEndSpacing;
    return Math.max(16, usableWidth / segments);
  }, [chartModel, chartWidth]);

  function handleChartBodyLayout(event: LayoutChangeEvent) {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0 && nextWidth !== bodyWidth) {
      setBodyWidth(nextWidth);
    }
  }

  function openRecordWeight() {
    router.push(WEIGHT_SHEET_HREF);
  }

  function openWeightScreen() {
    router.push({
      pathname: WEIGHT_SCREEN_HREF,
      params: { metric: "weight" },
    } as Href);
  }

  return (
    <WorkoutGlassCard style={globalStyles.workoutWeightTrendGlassCard}>
      <Pressable
        style={globalStyles.workoutWeightTrendCard}
        onPress={openWeightScreen}
        accessibilityRole="button"
        accessibilityLabel="Weight trend"
      >
        <View
          style={globalStyles.workoutWeightTrendHeader}
          accessibilityLabel={`${deltaSummary.arrowSymbol} ${deltaSummary.valueText} ${deltaSummary.unitLabel} ${deltaSummary.periodLabel}`}
        >
          <View style={globalStyles.workoutWeightTrendDelta}>
            <View style={globalStyles.workoutWeightTrendDeltaRow}>
              <Text style={globalStyles.workoutWeightTrendDeltaArrow}>
                {deltaSummary.arrowSymbol}
              </Text>
              <Text style={globalStyles.workoutWeightTrendDeltaValue}>
                {deltaSummary.valueText}
              </Text>
              <Text style={globalStyles.workoutWeightTrendDeltaUnit}>
                {deltaSummary.unitLabel}
              </Text>
            </View>
            <Text style={globalStyles.workoutWeightTrendDeltaPeriod}>
              {deltaSummary.periodLabel}
            </Text>
          </View>
        </View>

        {chartModel ? (
          <View
            style={globalStyles.workoutWeightTrendBody}
            onLayout={handleChartBodyLayout}
          >
            <View style={globalStyles.workoutWeightTrendPlotWrap}>
              <Text style={globalStyles.workoutWeightTrendTargetLabel}>
                Target Weight
              </Text>
              {mutableChart?.lastDisplayValue ? (
                <Text
                  style={[
                    globalStyles.workoutWeightTrendTargetValue,
                    { bottom: valueBottomOffset(mutableChart.lastValue) },
                  ]}
                >
                  {mutableChart.lastDisplayValue}
                </Text>
              ) : null}
              <Text
                style={[
                  globalStyles.workoutWeightTrendTargetValue,
                  { bottom: valueBottomOffset(chartModel.baselinePosition) },
                ]}
              >
                {chartModel.baselinePosition}
              </Text>
              <LineChart
                data={lineData}
                width={chartWidth}
                height={sizes.workoutWeightTrendPlotHeight}
                spacing={pointSpacing}
                initialSpacing={spacing.workoutWeightTrendInitialSpacing}
                endSpacing={spacing.workoutWeightTrendEndSpacing}
                overflowTop={spacing.workoutWeightTrendOverflowTop}
                color={colors.backArrow}
                thickness={sizes.workoutWeightTrendLineThickness}
                yAxisSide={yAxisSides.RIGHT}
                yAxisOffset={chartModel.yAxisOffset}
                maxValue={chartModel.maxValue}
                stepValue={chartModel.stepValue}
                noOfSections={chartModel.noOfSections}
                showFractionalValues={false}
                yAxisLabelWidth={sizes.workoutWeightTrendYAxisLabelWidth}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                yAxisTextStyle={{
                  ...globalStyles.workoutWeightTrendAxisText,
                  fontSize: 0,
                  lineHeight: 0,
                  opacity: 0,
                }}
                xAxisLabelTextStyle={{ ...globalStyles.workoutWeightTrendAxisText }}
                lineSegments={[
                  {
                    startIndex: lastRealPointIndex,
                    endIndex: lastRealPointIndex + 1,
                    strokeDashArray: [3, 3],
                    color: colors.backArrow,
                    thickness: sizes.workoutWeightTrendLineThickness,
                  },
                ]}
                showReferenceLine1
                referenceLine1Position={chartModel.baselinePosition}
                referenceLine1Config={{
                  type: "dashed",
                  color: colors.backArrow,
                  dashWidth: 3,
                  dashGap: 3,
                  thickness: 1,
                  width: Math.max(
                    80,
                    chartWidth - spacing.workoutWeightTrendEndSpacing,
                  ),
                  labelText: "",
                }}
                disableScroll
                disableForeignObject
              />
            </View>
            <View
              style={globalStyles.workoutWeightTrendXAxisRow}
            >
              {chartModel.xAxisLabels.map((dateLabel, idx) => (
                <Text
                  key={`${dateLabel}-${idx}`}
                  style={globalStyles.workoutWeightTrendAxisText}
                >
                  {dateLabel}
                </Text>
              ))}
            </View>
          </View>
        ) : (
          <View style={globalStyles.workoutWeightTrendEmptyWrap}>
            <Text style={globalStyles.workoutWeightTrendEmptyText}>
              {isLoading ? "loading…" : "no records yet"}
            </Text>
          </View>
        )}

        <View style={globalStyles.workoutWeightTrendFooter}>
          <Text style={globalStyles.workoutWeightTrendTitle}>WEIGHT TREND</Text>
          <Pressable
            style={globalStyles.workoutWeightTrendRecordButton}
            onPress={openRecordWeight}
            accessibilityRole="button"
            accessibilityLabel="Record Weight"
          >
            <Text style={globalStyles.workoutWeightTrendRecordButtonText}>
              Record Weight
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </WorkoutGlassCard>
  );
}
