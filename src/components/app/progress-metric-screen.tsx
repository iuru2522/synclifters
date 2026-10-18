import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import {
  buildProgressMetricChartModel,
  computePastWeekDelta,
} from "@/features/users/progress-metric-chart";
import type { BodyMetricEntry } from "@/features/users/types";
import { useUserBodyMetrics } from "@/features/users/user-body-metrics";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

type ProgressMetric = "weight" | "height";

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

export function ProgressMetricScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    metric?: string | string[];
  }>();
  const metric = parseProgressMetric(readSearchParam(params.metric));
  const config = METRIC_CONFIG[metric];
  const { entries, isLoading, error, refresh } = useUserBodyMetrics(metric);
  const [bodyWidth, setBodyWidth] = useState(312);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

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

  const pointSpacing = useMemo(() => {
    if (!chartModel) {
      return 60;
    }

    const segments = Math.max(1, chartModel.points.length - 1);
    const usableWidth =
      chartWidth -
      spacing.progressMetricChartInitialSpacing -
      spacing.progressMetricChartEndSpacing;
    return Math.max(24, usableWidth / segments);
  }, [chartModel, chartWidth]);

  const lineData = useMemo<lineDataItem[]>(() => {
    if (!chartModel) {
      return [];
    }

    return chartModel.points.map((point) => {
      if (point.isFirstRealPoint) {
        return {
          value: point.value,
          label: point.label,
          labelTextStyle: globalStyles.progressMetricChartXAxisText,
          hideDataPoint: false,
          dataPointRadius: 0,
          dataPointColor: "transparent",
          dataPointLabelWidth: sizes.progressMetricChartLabelWidth,
          dataPointLabelShiftX: 12,
          dataPointLabelShiftY: -22,
          dataPointLabelComponent: () => (
            <StartPointBadge label={point.displayValue} />
          ),
        };
      }

      if (point.isLastRealPoint) {
        return {
          value: point.value,
          label: point.label,
          labelTextStyle: globalStyles.progressMetricChartXAxisText,
          hideDataPoint: false,
          dataPointRadius: sizes.progressMetricChartDotRadius,
          dataPointColor: colors.progressChartDot,
          dataPointLabelWidth: sizes.progressMetricChartLabelWidth,
          dataPointLabelShiftX: 0,
          dataPointLabelShiftY: -26,
          dataPointLabelComponent: () => (
            <EndPointBadge label={point.displayValue} />
          ),
        };
      }

      if (point.isTrailingProjection) {
        return {
          value: point.value,
          label: "",
          hideDataPoint: true,
        };
      }

      return {
        value: point.value,
        label: point.label,
        labelTextStyle: globalStyles.progressMetricChartXAxisText,
        hideDataPoint: false,
        dataPointRadius: 3,
        dataPointColor: colors.white,
      };
    });
  }, [chartModel]);

  function handleChartBodyLayout(event: LayoutChangeEvent) {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0 && nextWidth !== bodyWidth) {
      setBodyWidth(nextWidth);
    }
  }

  function openRecordSheet() {
    const href =
      metric === "height"
        ? ("/workout/height-sheet?source=progress" as Href)
        : ("/workout/weight-sheet?source=progress" as Href);
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
          accessibilityLabel="Menu"
        >
          <CreateDayBurgerIcon />
        </Pressable>
      </View>

      <ScrollView
        style={globalStyles.progressMetricScroll}
        contentContainerStyle={globalStyles.progressMetricScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.progressMetricDiagramWrap}>
          <WorkoutGlassCard style={globalStyles.progressMetricChartCard}>
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
                  color={colors.white}
                  thickness={sizes.progressMetricChartLineThickness}
                  yAxisSide={yAxisSides.RIGHT}
                  yAxisOffset={chartModel.yAxisOffset}
                  maxValue={chartModel.maxValue}
                  stepValue={chartModel.stepValue}
                  noOfSections={chartModel.noOfSections}
                  yAxisLabelWidth={sizes.progressMetricChartYAxisLabelWidth}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules
                  yAxisTextStyle={globalStyles.progressMetricChartAxisText}
                  xAxisLabelTextStyle={globalStyles.progressMetricChartXAxisText}
                  lineSegments={[
                    {
                      startIndex: chartModel.lastRealIndex,
                      endIndex: chartModel.lastRealIndex + 1,
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
                  }}
                  disableScroll
                  disableForeignObject
                />
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
