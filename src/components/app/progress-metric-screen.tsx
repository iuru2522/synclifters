import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { readSearchParam } from "@/components/app/program-day-params";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useUserBodyMetrics } from "@/features/users/user-body-metrics";
import type { BodyMetricEntry } from "@/features/users/types";
import { globalStyles, sizes, spacing } from "@/styles/global";

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

export function ProgressMetricScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    metric?: string | string[];
  }>();
  const metric = parseProgressMetric(readSearchParam(params.metric));
  const config = METRIC_CONFIG[metric];
  const { entries, isLoading, error, refresh } = useUserBodyMetrics(metric);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

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
          <WorkoutGlassCard style={globalStyles.progressMetricDiagram}>
            <Text style={globalStyles.progressMetricDiagramLabel}>diagram</Text>
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
