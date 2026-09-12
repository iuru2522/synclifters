import { useFocusEffect, useRouter, type Href } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useUserSessions } from "@/features/workout/user-sessions";
import type { WorkoutSession } from "@/features/workout/types";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

function formatHistoryDate(session: WorkoutSession) {
  if (session.performedAt) {
    return new Date(session.performedAt)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  }

  if (session.date) {
    return session.date;
  }

  return "";
}

export function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessions, isLoading, error, refresh } = useUserSessions();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  function openSession(session: WorkoutSession) {
    const query = new URLSearchParams({
      sessionId: session.id,
      ...(session.programId ? { programId: session.programId } : {}),
      programName: session.programName,
      dayName: session.dayName,
      fromHistory: "1",
    }).toString();
    router.push(`/workout/program-day-exercise?${query}` as Href);
  }

  return (
    <View
      style={[
        globalStyles.historyScreen,
        {
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
        },
      ]}
    >
      <View style={globalStyles.createDayHeader}>
        <View style={globalStyles.createDayHeaderBack}>
          <AuthBackButton
            title=""
            style={globalStyles.programDayBackButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }

              router.navigate("/workout" as Href);
            }}
          />
        </View>
        <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
          HISTORY
        </Text>
      </View>
      <ScrollView
        style={globalStyles.progressScreenScroll}
        contentContainerStyle={globalStyles.historyButtons}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={globalStyles.workoutMyPrograms}>Loading history…</Text>
        ) : null}
        {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
        {!isLoading && !error && sessions.length === 0 ? (
          <Text style={globalStyles.workoutMyPrograms}>No workouts yet</Text>
        ) : null}
        {sessions.map((session) => {
          const title = `${session.programName} | ${session.dayName}`;
          const dateLabel = formatHistoryDate(session);

          return (
            <AppButton
              key={session.id}
              title={title}
              onPress={() => {
                openSession(session);
              }}
              borderColor={colors.white}
              borderWidth={sizes.workoutProgramThinBorderWidth}
              textColor={colors.inputFill}
              textStyle={globalStyles.historyButtonText}
              style={globalStyles.historyButton}
              pressAccentColor={colors.backArrow}
              rightIcon={
                dateLabel ? (
                  <Text style={globalStyles.historyButtonText}>{dateLabel}</Text>
                ) : undefined
              }
              accessibilityLabel={`${title} ${dateLabel}`.trim()}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
