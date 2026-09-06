import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { PROGRESS_METRIC_DETAIL_HREF } from "@/components/app/progress-metric-detail-screen";
import { readSearchParam } from "@/components/app/program-day-params";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

type ProgressMetric = "weight" | "height";

const METRIC_CONFIG: Record<
  ProgressMetric,
  {
    title: string;
    valueLabel: string;
  }
> = {
  weight: {
    title: "WEIGHT",
    valueLabel: "XXX KGS",
  },
  height: {
    title: "HEIGHT",
    valueLabel: "XXX CM",
  },
};

function parseProgressMetric(value: string | undefined): ProgressMetric {
  return value === "height" ? "height" : "weight";
}

export function ProgressMetricScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    metric?: string | string[];
  }>();
  const metric = parseProgressMetric(readSearchParam(params.metric));
  const config = METRIC_CONFIG[metric];

  function openMetricDetail() {
    router.push({
      pathname: PROGRESS_METRIC_DETAIL_HREF,
      params: { metric },
    } as Href);
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
          <Pressable
            style={globalStyles.progressMetricHistoryRow}
            onPress={openMetricDetail}
            accessibilityRole="button"
            accessibilityLabel={`${config.valueLabel}, Jul 2, 2025`}
          >
            <Text style={globalStyles.progressMetricHistoryDate}>Jul 2, 2025</Text>
            <View style={globalStyles.progressMetricHistoryValueWrap}>
              <Text style={globalStyles.progressMetricHistoryValue}>{config.valueLabel}</Text>
              <WorkoutExternalLinkIcon color={colors.backArrow} />
            </View>
          </Pressable>
          <View style={globalStyles.progressMetricHistoryDivider} />
        </View>

        <Pressable
          style={globalStyles.progressMetricRecordButton}
          onPress={openMetricDetail}
          accessibilityRole="button"
          accessibilityLabel="Record"
        >
          <Text style={globalStyles.progressMetricRecordButtonText}>RECORD</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
