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
  }
> = {
  weight: {
    title: "WEIGHT",
  },
  height: {
    title: "HEIGHT",
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

function StartPointBadge({ label }: { label: string }) {
  return (
    <View style={globalStyles.progressMetricChartStartBadgeWrap}>
      <View style={globalStyles.progressMetricChartStartBadgePointer} />
      <View style={globalStyles.progressMetricChartStartBadgePill}>
        <Text style={globalStyles.progressMetricChartBadgeText}>{label}</Text>
      </View>
    </View>
  );
}

function EndPointBadge({ label }: { label: string }) {
  return (
    <View style={globalStyles.progressMetricChartEndBadgeWrap}>
      <View style={globalStyles.progressMetricChartEndBadgePill}>
        <Text style={globalStyles.progressMetricChartBadgeText}>{label}</Text>
      </View>
      <View style={globalStyles.progressMetricChartEndBadgePointer} />
    </View>
  );
}

function buildMutableChartData(
  chartModel: NonNullable<ReturnType<typeof buildProgressMetricChartModel>>,
): { items: lineDataItem[]; lastRealPointIndex: number } {
  "use no memo";
  const realPoints = chartModel.points.filter((point) => !point.isTrailingProjection);
  const trailingPoint =
    chartModel.points.find((point) => point.isTrailingProjection) ??
    realPoints[realPoints.length - 1];

  const targetRealCount = Math.max(sizes.progressMetricChartSegments, realPoints.length);
  const firstPoint = realPoints[0];
  const lastPoint = realPoints[realPoints.length - 1];

  const expandedRealPoints =
    realPoints.length >= targetRealCount
      ? realPoints.map((point, index) => ({
          value: point.value,
          displayValue: point.displayValue,
          isFirstRealPoint: index === 0,
          isLastRealPoint: index === realPoints.length - 1,
          isInterpolated: false,
        }))
      : Array.from({ length: targetRealCount }, (_, index) => {
          if (index === 0) {
            return {
              value: firstPoint.value,
              displayValue: firstPoint.displayValue,
              isFirstRealPoint: true,
              isLastRealPoint: false,
              isInterpolated: false,
            };
          }
          if (index === targetRealCount - 1) {
            return {
              value: lastPoint.value,
              displayValue: lastPoint.displayValue,
              isFirstRealPoint: false,
              isLastRealPoint: true,
              isInterpolated: false,
            };
          }
          const progress = index / (targetRealCount - 1);
          const ExactIndex = progress * (realPoints.length - 1);
          const lowerIndex = Math.floor(ExactIndex);
          const upperIndex = Math.min(realPoints.length - 1, Math.ceil(ExactIndex));
          const fraction = ExactIndex - lowerIndex;
          const interpolatedValue =
            realPoints[lowerIndex].value +
            (realPoints[upperIndex].value - realPoints[lowerIndex].value) * fraction;
          return {
            value: interpolatedValue,
            displayValue: "",
            isFirstRealPoint: false,
            isLastRealPoint: false,
            isInterpolated: true,
          };
        });

  const items: lineDataItem[] = expandedRealPoints.map((point) => {
    if (point.isFirstRealPoint) {
      return {
        value: point.value,
        label: "",
        hideDataPoint: false,
        dataPointRadius: 0,
        dataPointColor: "transparent",
        dataPointLabelWidth: sizes.progressMetricChartLabelWidth,
        dataPointLabelShiftX: spacing.progressMetricChartStartBadgeShiftX,
        dataPointLabelShiftY: spacing.progressMetricChartStartBadgeShiftY,
        dataPointLabelComponent: () => (
          <StartPointBadge label={point.displayValue} />
        ),
      };
    }

    if (point.isLastRealPoint) {
      return {
        value: point.value,
        label: "",
        hideDataPoint: false,
        dataPointRadius: sizes.progressMetricChartDotRadius,
        dataPointColor: colors.progressChartDot,
        dataPointLabelWidth: sizes.progressMetricChartLabelWidth,
        dataPointLabelShiftX: 0,
        dataPointLabelShiftY: spacing.progressMetricChartEndBadgeShiftY,
        dataPointLabelComponent: () => (
          <EndPointBadge label={point.displayValue} />
        ),
      };
    }

    if (point.isInterpolated) {
      return {
        value: point.value,
        label: "",
        hideDataPoint: true,
      };
    }

    return {
      value: point.value,
      label: "",
      hideDataPoint: false,
      dataPointRadius: 3,
      dataPointColor: colors.white,
    };
  });

  items.push({
    value: trailingPoint.value,
    label: "",
    hideDataPoint: true,
  });

  return {
    items,
    lastRealPointIndex: expandedRealPoints.length - 1,
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
    bodyWidth - sizes.progressMetricChartYAxisLabelWidth,
  );

  const mutableChart = chartModel ? buildMutableChartData(chartModel) : null;
  const lineData = mutableChart ? mutableChart.items : [];
  const lastRealPointIndex = mutableChart
    ? mutableChart.lastRealPointIndex
    : chartModel?.lastRealIndex ?? 0;

  const pointSpacing = useMemo(() => {
    const segments = Math.max(
      sizes.progressMetricChartSegments,
      (chartModel?.points.length ?? 2) - 1,
    );
    const usableWidth =
      chartWidth -
      spacing.progressMetricChartInitialSpacing -
      spacing.progressMetricChartEndSpacing;
    return Math.max(18, usableWidth / segments);
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
                <LineChart
                  data={lineData}
                  width={chartWidth}
                  height={sizes.progressMetricChartPlotHeight}
                  spacing={pointSpacing}
                  initialSpacing={spacing.progressMetricChartInitialSpacing}
                  endSpacing={spacing.progressMetricChartEndSpacing}
                  overflowTop={spacing.progressMetricChartOverflowTop}
                  color={colors.white}
                  thickness={sizes.progressMetricChartLineThickness}
                  yAxisSide={yAxisSides.RIGHT}
                  yAxisOffset={chartModel.yAxisOffset}
                  maxValue={chartModel.maxValue}
                  stepValue={chartModel.stepValue}
                  noOfSections={chartModel.noOfSections}
                  showFractionalValues={false}
                  yAxisLabelWidth={sizes.progressMetricChartYAxisLabelWidth}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules
                  yAxisTextStyle={{ ...globalStyles.progressMetricChartAxisText }}
                  xAxisLabelTextStyle={{ ...globalStyles.progressMetricChartXAxisText }}
                  lineSegments={[
                    {
                      startIndex: lastRealPointIndex,
                      endIndex: lastRealPointIndex + 1,
                      strokeDashArray: [3, 3],
                      color: colors.progressChartDashedLine,
                      thickness: sizes.progressMetricChartLineThickness,
                    },
                  ]}
                  showReferenceLine1
                  referenceLine1Position={chartModel.baselinePosition}
                  referenceLine1Config={{
                    type: "dashed",
                    color: colors.progressChartReferenceLine,
                    dashWidth: 3,
                    dashGap: 3,
                    thickness: 1,
                    width: Math.max(80, chartWidth - spacing.progressMetricChartEndSpacing),
                    labelText: String(chartModel.baselinePosition),
                    labelTextStyle: {
                      ...globalStyles.progressMetricChartReferenceLabelText,
                      left: spacing.progressMetricChartReferenceLabelOffset,
                    },
                  }}
                  disableScroll
                  disableForeignObject
                />
                <View
                  style={[
                    globalStyles.progressMetricChartXAxisRow,
                    {
                      paddingLeft: spacing.progressMetricChartInitialSpacing,
                      paddingRight:
                        sizes.progressMetricChartYAxisLabelWidth +
                        Math.round(pointSpacing * 0.65),
                    },
                  ]}
                >
                  {chartModel.xAxisLabels.map((dateLabel, idx) => (
                    <Text
                      key={`${dateLabel}-${idx}`}
                      style={globalStyles.progressMetricChartXAxisText}
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
          <View style={globalStyles.progressMetricHistoryDivider} />
          {isLoading ? (
            <Text style={globalStyles.workoutMyPrograms}>Loading history…</Text>
          ) : null}
          {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
          {!isLoading && !error && entries.length === 0 ? (
            <Text style={globalStyles.workoutMyPrograms}>No records yet</Text>
          ) : null}
          {entries.map((entry) => {
            const dateLabel = formatMetricDate(entry);
            const valueLabel = formatMetricValue(entry);

            return (
              <View key={entry.id}>
                <View
                  style={globalStyles.progressMetricHistoryRow}
                  accessibilityLabel={`${valueLabel}${dateLabel ? `, ${dateLabel}` : ""}`}
                >
                  <Text style={globalStyles.progressMetricHistoryDate}>{dateLabel}</Text>
                  <View style={globalStyles.progressMetricHistoryValueWrap}>
                    <Text style={globalStyles.progressMetricHistoryValue}>{valueLabel}</Text>
                  </View>
                </View>
                <View style={globalStyles.progressMetricHistoryDivider} />
              </View>
            );
          })}
          {entries.length === 0 ? (
            <View style={globalStyles.progressMetricHistoryDivider} />
          ) : null}
        </View>

        <Pressable
          style={globalStyles.progressMetricRecordButton}
          onPress={openRecordSheet}
          accessibilityRole="button"
          accessibilityLabel="Record"
        >
          <Text style={globalStyles.progressMetricRecordButtonText}>RECORD</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
