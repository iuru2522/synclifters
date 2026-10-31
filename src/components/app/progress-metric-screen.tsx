import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import {
  LineChart,
  yAxisSides,
  type lineDataItem,
} from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlidersHIcon } from "@/components/app/sliders-h-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import {
  buildProgressMetricChartModel,
  computePastWeekDelta,
} from "@/features/users/progress-metric-chart";
import type { BodyMetricEntry } from "@/features/users/types";
import { useUserBodyMetrics } from "@/features/users/user-body-metrics";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

type ProgressMetric = "weight" | "height";
type ChartRangeOption = "1W" | "1M" | "3M" | "6M" | "1Y" | "All" | "Plan";

const CHART_RANGE_OPTIONS: readonly ChartRangeOption[] = [
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
  "All",
  "Plan",
];

const METRIC_CONFIG: Record<
  ProgressMetric,
  {
    title: string;
    recordLabel: string;
  }
> = {
  weight: {
    title: "WEIGHT",
    recordLabel: "RECORD",
  },
  height: {
    title: "HEIGHT",
    recordLabel: "RECORD",
  },
};

function parseProgressMetric(value: string | undefined): ProgressMetric {
  return value === "height" ? "height" : "weight";
}

function formatMetricDate(entry: BodyMetricEntry) {
  if (entry.recordedAt == null) {
    return "";
  }

  return new Date(entry.recordedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMetricValue(entry: BodyMetricEntry) {
  const unit = entry.unit.trim().toUpperCase();
  return unit ? `${entry.value} ${unit}` : String(entry.value);
}

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

export function ProgressMetricScreen() {
  "use no memo";
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    metric?: string | string[];
  }>();
  const metric = parseProgressMetric(readSearchParam(params.metric));
  const config = METRIC_CONFIG[metric];
  const { entries, isLoading, error, refresh } = useUserBodyMetrics(metric);
  const [bodyWidth, setBodyWidth] = useState(312);
  const [selectedRange, setSelectedRange] = useState<ChartRangeOption>("1W");

  useRefreshOnFocus(refresh);

  const chartModel = useMemo(
    () => buildProgressMetricChartModel(entries, metric),
    [entries, metric],
  );
  const deltaSummary = useMemo(
    () => chartModel?.delta ?? computePastWeekDelta(entries, metric),
    [chartModel, entries, metric],
  );

  const chartWidth = Math.max(
    180,
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

  function openRecordSheet() {
    const href =
      metric === "height"
        ? ("/height-sheet?source=progress" as Href)
        : ("/weight-sheet?source=progress" as Href);
    router.push(href);
  }

  return (
    <View
      style={[
        globalStyles.createProgramScreen,
        {
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
        },
      ]}
    >
      <View style={globalStyles.createDayHeader}>
        <View style={globalStyles.createDayHeaderBack}>
          <AuthBackButton
            title=""
            onPress={() => {
              router.back();
            }}
          />
        </View>
        <Text style={globalStyles.createDayHeaderTitle}>{config.title}</Text>
        <Pressable
          style={globalStyles.createDayHeaderMenu}
          onPress={() => {}}
          hitSlop={sizes.backArrowHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Filters"
        >
          <SlidersHIcon />
        </Pressable>
      </View>

      <ScrollView
        style={globalStyles.progressMetricScroll}
        contentContainerStyle={globalStyles.progressMetricScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.progressMetricDiagramWrap}>
          <WorkoutGlassCard style={globalStyles.progressMetricChartCard}>
            <View style={globalStyles.progressMetricChartRangeBar}>
              {CHART_RANGE_OPTIONS.map((option) => {
                const isActive = option === selectedRange;
                return (
                  <Pressable
                    key={option}
                    style={[
                      globalStyles.progressMetricChartRangeTab,
                      isActive ? globalStyles.progressMetricChartRangeTabActive : null,
                    ]}
                    onPress={() => {
                      setSelectedRange(option);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={option}
                  >
                    <Text
                      style={[
                        globalStyles.progressMetricChartRangeTabText,
                        isActive
                          ? globalStyles.progressMetricChartRangeTabTextActive
                          : null,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View
              style={globalStyles.progressMetricChartHeader}
              accessibilityLabel={`${deltaSummary.arrowSymbol} ${deltaSummary.valueText} ${deltaSummary.unitLabel} ${deltaSummary.periodLabel}`}
            >
              <View style={globalStyles.progressMetricChartDeltaRow}>
                <Text style={globalStyles.progressMetricChartDeltaArrow}>
                  {deltaSummary.arrowSymbol}
                </Text>
                <Text style={globalStyles.progressMetricChartDeltaValue}>
                  {deltaSummary.valueText}
                </Text>
                <Text style={globalStyles.progressMetricChartDeltaUnit}>
                  {deltaSummary.unitLabel}
                </Text>
              </View>
              <Text style={globalStyles.progressMetricChartDeltaPeriod}>
                {deltaSummary.periodLabel}
              </Text>
            </View>

            {chartModel ? (
              <View
                style={globalStyles.progressMetricChartBody}
                onLayout={handleChartBodyLayout}
              >
                {metric === "weight" ? (
                  <Text style={globalStyles.workoutWeightTrendTargetLabel}>
                    Target Weight
                  </Text>
                ) : null}
                <LineChart
                  data={lineData}
                  width={chartWidth}
                  height={sizes.progressMetricChartPlotHeight}
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
              <View style={globalStyles.progressMetricChartEmptyWrap}>
                <Text style={globalStyles.progressMetricDiagramLabel}>
                  {isLoading ? "loading…" : "no records yet"}
                </Text>
              </View>
            )}
          </WorkoutGlassCard>
        </View>

        <View style={globalStyles.progressMetricHistoryBlock}>
          {isLoading ? (
            <Text style={globalStyles.workoutMyPrograms}>Loading history…</Text>
          ) : null}
          {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
          {!isLoading && !error && entries.length === 0 ? (
            <Text style={globalStyles.workoutMyPrograms}>No records yet</Text>
          ) : null}
          {entries.map((entry, index) => {
            const dateLabel = formatMetricDate(entry);
            const valueLabel = formatMetricValue(entry);

            return (
              <View key={entry.id}>
                {index === 0 ? (
                  <View style={globalStyles.progressMetricHistoryDivider} />
                ) : null}
                <View
                  style={globalStyles.progressMetricHistoryRow}
                  accessibilityLabel={`${valueLabel}${dateLabel ? `, ${dateLabel}` : ""}`}
                >
                  <Text style={globalStyles.progressMetricHistoryDate}>{dateLabel}</Text>
                  <Text style={globalStyles.progressMetricHistoryValue}>{valueLabel}</Text>
                </View>
                <View style={globalStyles.progressMetricHistoryDivider} />
              </View>
            );
          })}
        </View>

        <Pressable
          style={globalStyles.progressMetricRecordButton}
          onPress={openRecordSheet}
          accessibilityRole="button"
          accessibilityLabel={config.recordLabel}
        >
          <Text style={globalStyles.progressMetricRecordButtonText}>
            {config.recordLabel}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
