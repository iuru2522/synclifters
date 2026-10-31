import { useFocusEffect, useRouter, type Href } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const WEIGHT_SHEET_HREF = "/workout/weight-sheet?source=workout" as Href;
const WEIGHT_SCREEN_HREF = "/workout/progress-metric" as Href;

function PointValueLabel({ label }: { label: string }) {
  return (
    <View style={globalStyles.workoutWeightTrendPointLabelWrap}>
      <Text style={globalStyles.workoutWeightTrendPointLabel}>{label}</Text>
    </View>
  );
}

function buildCompactChartData(
  chartModel: NonNullable<ReturnType<typeof buildProgressMetricChartModel>>,
): { items: lineDataItem[]; lastRealPointIndex: number } {
  "use no memo";
  const realPoints = chartModel.points.filter((point) => !point.isTrailingProjection);
  const trailingPoint =
    chartModel.points.find((point) => point.isTrailingProjection) ??
    realPoints[realPoints.length - 1];

  const middleIndex =
    realPoints.length >= 3 ? Math.floor((realPoints.length - 1) / 2) : -1;

  const items: lineDataItem[] = realPoints.map((point, index) => {
    const showLabel =
      point.isFirstRealPoint ||
      point.isLastRealPoint ||
      index === middleIndex;

    return {
      value: point.value,
      label: "",
      hideDataPoint: false,
      dataPointRadius: sizes.workoutWeightTrendDotRadius,
      dataPointColor: colors.backArrow,
      dataPointLabelWidth: sizes.workoutWeightTrendPointLabelWidth,
      dataPointLabelShiftX: 0,
      dataPointLabelShiftY: spacing.workoutWeightTrendPointLabelShiftY,
      dataPointLabelComponent: showLabel
        ? () => <PointValueLabel label={point.displayValue} />
        : undefined,
    };
  });

  items.push({
    value: trailingPoint.value,
    label: "",
    hideDataPoint: true,
  });

  return {
    items,
    lastRealPointIndex: realPoints.length - 1,
  };
}

export function WorkoutWeightTrendChart() {
  "use no memo";
  const router = useRouter();
  const { entries, isLoading, refresh } = useUserBodyMetrics("weight");
  const [bodyWidth, setBodyWidth] = useState(320);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

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
    <WorkoutGlassCard style={globalStyles.workoutGlassCardWide}>
      <Pressable
        style={globalStyles.workoutWeightTrendCard}
        onPress={openWeightScreen}
        accessibilityRole="button"
        accessibilityLabel="Weight trend"
      >
        <View
          style={globalStyles.workoutWeightTrendDelta}
          accessibilityLabel={`${deltaSummary.arrowSymbol} ${deltaSummary.valueText} ${deltaSummary.unitLabel} ${deltaSummary.periodLabel}`}
        >
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

        {chartModel ? (
          <View
            style={globalStyles.workoutWeightTrendBody}
            onLayout={handleChartBodyLayout}
          >
            <Text style={globalStyles.workoutWeightTrendTargetLabel}>
              Target Weight
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
              yAxisTextStyle={{ ...globalStyles.workoutWeightTrendAxisText }}
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
                labelText: String(chartModel.baselinePosition),
                labelTextStyle: {
                  ...globalStyles.workoutWeightTrendReferenceLabelText,
                },
              }}
              disableScroll
              disableForeignObject
            />
            <View
              style={[
                globalStyles.workoutWeightTrendXAxisRow,
                {
                  paddingLeft: spacing.workoutWeightTrendInitialSpacing,
                  paddingRight:
                    sizes.workoutWeightTrendYAxisLabelWidth +
                    Math.round(pointSpacing * 0.35),
                },
              ]}
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
