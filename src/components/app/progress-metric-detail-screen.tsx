import { useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const HISTORY_ENTRIES = [
  {
    date: "Jul 11, 2025",
    program: "DAY NAME - PROGRAM'S NAME",
    sets: "25X10, 35X6, 45X4, 59X7, 59X8",
    weight: "1200 Kgs",
  },
  {
    date: "Jul 2, 2025",
    program: "DAY NAME - PROGRAM'S NAME",
    sets: "25X10, 35X6, 45X4, 59X7, 59X8",
    weight: "1100 Kgs",
  },
  {
    date: "Jul 2, 2025",
    program: "DAY NAME - PROGRAM'S NAME",
    sets: "25X10, 35X6, 45X4, 59X7, 59X8",
    weight: "1100 Kgs",
  },
  {
    date: "Jul 2, 2025",
    program: "DAY NAME - PROGRAM'S NAME",
    sets: "25X10, 35X6, 45X4, 59X7, 59X8",
    weight: "1100 Kgs",
  },
  {
    date: "Jul 2, 2025",
    program: "DAY NAME - PROGRAM'S NAME",
    sets: "25X10, 35X6, 45X4, 59X7, 59X8",
    weight: "1100 Kgs",
  },
  {
    date: "Jul 2, 2025",
    program: "DAY NAME - PROGRAM'S NAME",
    sets: "25X10, 35X6, 45X4, 59X7, 59X8",
    weight: "1100 Kgs",
  },
  {
    date: "Jul 2, 2025",
    program: "DAY NAME - PROGRAM'S NAME",
    sets: "25X10, 35X6, 45X4, 59X7, 59X8",
    weight: "1100 Kgs",
  },
] as const;

export function ProgressMetricDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const title = "BARBELL BENCH PRESS";

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
        <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
          {title}
        </Text>
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
        contentContainerStyle={globalStyles.progressMetricDetailScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.progressMetricDiagramWrap}>
          <WorkoutGlassCard style={globalStyles.progressMetricDiagram}>
            <Text style={globalStyles.progressMetricDiagramLabel}>diagram</Text>
          </WorkoutGlassCard>
        </View>

        <Text style={globalStyles.exerciseHistoryLabel}>HISTORY</Text>
        <View style={globalStyles.exerciseHistoryButtonsRow}>
          {HISTORY_ENTRIES.map((entry, index) => (
            <AppButton
              key={`${entry.date}-${index}`}
              title=""
              onPress={() => {}}
              borderColor={colors.backArrow}
              borderWidth={sizes.workoutProgramThinBorderWidth}
              textColor={colors.inputFill}
              pressAccentColor={colors.backArrow}
              textStyle={globalStyles.exerciseHistoryButtonSpacer}
              leftIcon={
                <View style={globalStyles.exerciseHistoryButtonContent}>
                  <View style={globalStyles.exerciseHistoryButtonRow}>
                    <Text style={globalStyles.exerciseHistoryButtonDate}>{entry.date}</Text>
                    <Text style={globalStyles.exerciseHistoryButtonProgram}>{entry.program}</Text>
                  </View>
                  <View style={globalStyles.exerciseHistoryButtonRow}>
                    <Text style={globalStyles.exerciseHistoryButtonDate}>{entry.sets}</Text>
                    <Text style={globalStyles.exerciseHistoryButtonWeight}>{entry.weight}</Text>
                  </View>
                </View>
              }
              style={[
                globalStyles.workoutCreateProgramThinBorder,
                globalStyles.exerciseHistoryButton,
              ]}
              accessibilityLabel={`${entry.date}, ${entry.sets}, ${entry.program}, ${entry.weight}`}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export const PROGRESS_METRIC_DETAIL_HREF = "/workout/progress-metric-detail" as Href;
