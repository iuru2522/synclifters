import { AppButton } from "@/components/app-button";
import { WorkoutBellIcon } from "@/components/app/workout-bell-icon";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { WorkoutStartIcon } from "@/components/app/workout-start-icon";
import { WeekCalendar } from "@/components/WeekCalendar/WeekCalendar";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileFullName } from "@/features/users/profile-display";
import { useUserPrograms } from "@/features/workout/user-programs";
import { useUserSessions } from "@/features/workout/user-sessions";
import { colors, globalStyles, sizes } from "@/styles/global";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PROFILE_HREF = "/workout/profile" as Href;
const CREATE_PROGRAM_HREF = "/workout/create-program" as Href;
const START_WORKOUT_HREF = "/workout/start-workout" as Href;

type StartTrainingSelection = "program" | "day";

export function WorkoutTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { programs, isLoading, error, refresh } = useUserPrograms();
  const {
    activityDates,
    refresh: refreshSessions,
  } = useUserSessions();
  const fullName = formatProfileFullName(profile);
  let trainingDaysCount = 0;
  if (profile && profile.stats && typeof profile.stats.trainingDaysCount === "number") {
    trainingDaysCount = profile.stats.trainingDaysCount;
  }
  let weightValue = "—";
  if (profile && typeof profile.weight === "number") {
    weightValue = String(profile.weight);
  }
  let weightUnit = "";
  if (profile && profile.weightUnit === "lb") {
    weightUnit = "LB";
  } else if (profile && profile.weightUnit === "kg") {
    weightUnit = "KG";
  }
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [startTrainingSelection, setStartTrainingSelection] =
    useState<StartTrainingSelection | null>(null);
  const favoriteProgram = programs.find((program) => program.isFavorite) ?? null;
  const favoriteDay = favoriteProgram?.days[0] ?? null;
  const selectedProgramTitle = favoriteProgram?.name ?? "No program selected";
  const selectedDayTitle = favoriteDay?.name ?? "No day selected";

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshSessions();
    }, [refresh, refreshSessions]),
  );

  const programSelected = startTrainingSelection === "program";
  const daySelected = startTrainingSelection === "day";

  function openFavoriteProgram() {
    if (!favoriteProgram) {
      router.push(START_WORKOUT_HREF);
      return;
    }

    setStartTrainingSelection("program");
    const query = new URLSearchParams({
      programId: favoriteProgram.id,
      programName: favoriteProgram.name,
    }).toString();
    router.push(`/workout/program-day?${query}` as Href);
  }

  function openFavoriteDay() {
    if (!favoriteProgram || !favoriteDay) {
      router.push(START_WORKOUT_HREF);
      return;
    }

    setStartTrainingSelection("day");
    const query = new URLSearchParams({
      programId: favoriteProgram.id,
      programName: favoriteProgram.name,
      dayName: favoriteDay.name,
    }).toString();
    router.push(`/workout/program-day-exercise?${query}` as Href);
  }

  return (
    <View style={[globalStyles.workoutScreen, { paddingTop: insets.top }]}>
      <ScrollView
        style={globalStyles.workoutScreenScroll}
        contentContainerStyle={globalStyles.workoutScreenScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.workoutScreenHeader}>
          <View style={globalStyles.workoutGreetingBlock}>
            <Text style={globalStyles.workoutGreeting}>Good morning,</Text>
            <Text style={globalStyles.workoutUserName}>{fullName}</Text>
          </View>
          <View style={globalStyles.workoutHeaderActions}>
            <WorkoutBellIcon />
            <Pressable
              style={globalStyles.workoutProfileButton}
              onPress={() => {
                router.push(PROFILE_HREF);
              }}
              hitSlop={sizes.backArrowHitSlop}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            />
          </View>
        </View>
        <View style={globalStyles.workoutGlassCardsRow}>
          <WorkoutGlassCard style={globalStyles.workoutGlassCard}>
            <View style={globalStyles.workoutGlassCardContent}>
              <Text style={globalStyles.workoutGlassCardValue}>{trainingDaysCount}</Text>
              <Text style={globalStyles.workoutGlassCardLabel}>TRAINING DAYS</Text>
            </View>
          </WorkoutGlassCard>
          <WorkoutGlassCard style={globalStyles.workoutGlassCard}>
            <View style={globalStyles.workoutGlassCardContent}>
              <Text style={globalStyles.workoutGlassCardValue}>
                {weightValue}
                {weightUnit ? (
                  <Text style={globalStyles.workoutGlassCardLabel}>{weightUnit}</Text>
                ) : null}
              </Text>
              <Text style={globalStyles.workoutGlassCardLabel}>CURRENT WEIGHT</Text>
            </View>
          </WorkoutGlassCard>
        </View>
        <View style={globalStyles.workoutGlassCardWideWrap}>
          <WorkoutGlassCard style={globalStyles.workoutGlassCardWide} />
        </View>
        <View style={globalStyles.workoutWeekCalendarWrap}>
          <WeekCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            activityDates={activityDates}
          />
        </View>
        <View style={globalStyles.workoutStartTrainingLabel}>
          <Text style={globalStyles.workoutGlassCardLabel}>START TRAINING</Text>
        </View>
        <Text style={globalStyles.workoutMyPrograms}>Selected Program</Text>
        <View style={globalStyles.workoutSelectedProgramButtonWrap}>
          <AppButton
            title={selectedProgramTitle}
            onPress={openFavoriteProgram}
            borderColor={colors.backArrow}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            textColor={programSelected ? colors.inputText : colors.inputFill}
            textStyle={[
              globalStyles.workoutProgramOutlinedButtonText,
              programSelected ? globalStyles.workoutSelectedProgramButtonTextSelected : null,
            ]}
            style={[
              globalStyles.workoutSelectedProgramButton,
              programSelected ? globalStyles.workoutSelectedProgramButtonSelected : null,
            ]}
            pressFillColor={programSelected ? undefined : colors.backArrow}
            pressLabelColor={programSelected ? undefined : colors.inputText}
          />
        </View>
        <Text style={globalStyles.workoutStartTrainingDay}>Day</Text>
        <View style={globalStyles.workoutSelectedProgramButtonWrap}>
          <AppButton
            title={selectedDayTitle}
            onPress={openFavoriteDay}
            borderColor={colors.backArrow}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            textColor={daySelected ? colors.inputText : colors.inputFill}
            textStyle={[
              globalStyles.workoutProgramOutlinedButtonText,
              daySelected ? globalStyles.workoutSelectedProgramButtonTextSelected : null,
            ]}
            style={[
              globalStyles.workoutSelectedProgramButton,
              daySelected ? globalStyles.workoutSelectedProgramButtonSelected : null,
            ]}
            pressFillColor={daySelected ? undefined : colors.backArrow}
            pressLabelColor={daySelected ? undefined : colors.inputText}
          />
        </View>
        <Pressable
          style={globalStyles.workoutStartTrainingGreenBar}
          onPress={() => {
            router.push(START_WORKOUT_HREF);
          }}
          accessibilityRole="button"
          accessibilityLabel="Start Workout"
        >
          <Text style={globalStyles.workoutStartTrainingGreenBarText}>Start Workout</Text>
        </Pressable>
        <View style={globalStyles.workoutTrainingProgramsLabel}>
          <Text style={globalStyles.workoutGlassCardLabel}>TRAINING PROGRAMS</Text>
        </View>
        <Text style={globalStyles.workoutMyPrograms}>My Programs</Text>
        <View style={globalStyles.workoutCreateProgramButton}>
          {isLoading ? (
            <Text style={globalStyles.workoutMyPrograms}>Loading programs…</Text>
          ) : null}
          {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
          {!isLoading && !error && programs.length === 0 ? (
            <Text style={globalStyles.workoutMyPrograms}>No programs yet</Text>
          ) : null}
          {programs.map((program) => (
            <AppButton
              key={program.id}
              title={program.name}
              onPress={() => {
                const query = new URLSearchParams({
                  programId: program.id,
                  programName: program.name,
                }).toString();
                router.push(`/workout/program-day?${query}` as Href);
              }}
              borderColor={colors.backArrow}
              textColor={colors.inputText}
              textStyle={globalStyles.workoutProgramFilledButtonText}
              style={globalStyles.workoutProgramFilledButton}
              leftIcon={<WorkoutExternalLinkIcon />}
              rightIcon={
                <WorkoutStartIcon
                  variant={program.isFavorite ? "filled" : "outline"}
                />
              }
            />
          ))}
          <AppButton
            title="Create New Program"
            onPress={() => {
              router.push(CREATE_PROGRAM_HREF);
            }}
            borderColor={colors.white}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            pressAccentColor={colors.backArrow}
            style={globalStyles.workoutCreateProgramThinBorder}
          />
        </View>
        <Text style={globalStyles.workoutMyPrograms}>Preset Workouts</Text>
        <View style={globalStyles.workoutCreateProgramButton}>
          <AppButton
            title="Full Body Burn"
            subtitle="3 Days/Week"
            subtitleMeta="Advanced"
            onPress={() => {}}
            borderColor={colors.backArrow}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            textColor={colors.inputFill}
            textStyle={globalStyles.workoutProgramOutlinedButtonText}
            subtitleStyle={globalStyles.workoutProgramOutlinedButtonSubtitle}
            subtitleMetaStyle={globalStyles.workoutProgramOutlinedButtonSubtitleMeta}
            pressAccentColor={colors.backArrow}
            style={globalStyles.workoutProgramOutlinedButton}
            leftIcon={<WorkoutExternalLinkIcon color={colors.backArrow} />}
            rightIcon={<WorkoutStartIcon variant="filled" color={colors.backArrow} />}
          />
          <AppButton
            title="Full Strength"
            subtitle="3 Days/Week"
            subtitleMeta="Advanced"
            onPress={() => {}}
            borderColor={colors.backArrow}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            textColor={colors.inputFill}
            textStyle={globalStyles.workoutProgramOutlinedButtonText}
            subtitleStyle={globalStyles.workoutProgramOutlinedButtonSubtitle}
            subtitleMetaStyle={globalStyles.workoutProgramOutlinedButtonSubtitleMeta}
            pressAccentColor={colors.backArrow}
            style={globalStyles.workoutProgramOutlinedButton}
            leftIcon={<WorkoutExternalLinkIcon color={colors.backArrow} />}
            rightIcon={<WorkoutStartIcon variant="outline" color={colors.backArrow} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
