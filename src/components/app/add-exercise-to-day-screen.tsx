import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import {
  parseDayNames,
  readSearchParam,
  serializeDayNames,
} from "@/components/app/program-day-params";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useAuth } from "@/features/auth/auth-context";
import { useExercisesByDay } from "@/features/workout/day-exercises";
import { saveUserProgram } from "@/features/workout/user-programs";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function AddExerciseToDayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const exercisesByDay = useExercisesByDay();
  const [isSaving, setIsSaving] = useState(false);
  const params = useLocalSearchParams<{
    programName?: string | string[];
    dayNames?: string | string[];
    dayName?: string | string[];
  }>();
  const programName = readSearchParam(params.programName);
  const dayNames = (() => {
    const parsed = parseDayNames(params.dayNames);
    if (parsed.length > 0) {
      return parsed;
    }

    const single = readSearchParam(params.dayName);
    return single ? [single] : [];
  })();
  const bottomPadding = Math.max(insets.bottom, spacing.safeAreaBottomMin);

  const handleSave = async () => {
    if (!programName) {
      Alert.alert("Program name required", "Go back and enter a program name.");
      return;
    }

    if (!user) {
      Alert.alert("Sign in required", "Sign in to save your program.");
      return;
    }

    if (dayNames.length === 0) {
      Alert.alert("Day required", "Add at least one day before saving.");
      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await saveUserProgram({
        uid: user.uid,
        name: programName,
        dayNames,
        exercisesByDay,
      });
      router.dismissTo("/workout" as Href);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save program.";
      Alert.alert("Save failed", message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={globalStyles.createProgramScreen}>
      <ScrollView
        style={globalStyles.addExerciseScreenScroll}
        contentContainerStyle={[
          globalStyles.addExerciseScreenScrollContent,
          {
            paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
            paddingBottom: bottomPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          {programName ? (
            <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
              {programName}
            </Text>
          ) : null}
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

        <View style={globalStyles.addExerciseDayRecords}>
          {dayNames.map((name, index) => {
            const exercises = exercisesByDay[name] ?? [];

            return (
              <View key={`${name}-${index}`} style={globalStyles.addExerciseDayRecord}>
                <View style={globalStyles.createDayAccentBar}>
                  <Text style={globalStyles.createDayAccentBarDayLabel} numberOfLines={1}>
                    {name}
                  </Text>
                </View>
                {exercises.length > 0 ? (
                  <View style={globalStyles.addExerciseDayExercises}>
                    {exercises.map((exercise) => (
                      <View key={exercise.id} style={globalStyles.doExerciseItem}>
                        <View style={globalStyles.doExerciseSelectTarget}>
                          <View style={globalStyles.doExerciseCircle} />
                          <Text style={globalStyles.doExerciseName} numberOfLines={1}>
                            {exercise.name}
                          </Text>
                        </View>
                        <WorkoutExternalLinkIcon color={colors.backArrow} />
                      </View>
                    ))}
                  </View>
                ) : null}
                <Pressable
                  style={globalStyles.addExerciseDayRecordLink}
                  onPress={() => {
                    const query = new URLSearchParams({
                      dayName: name,
                      dayNames: serializeDayNames(dayNames),
                      ...(programName ? { programName } : {}),
                    }).toString();
                    router.push(`/workout/add-exercise?${query}` as Href);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Add exercise to ${name}`}
                >
                  <Text style={globalStyles.addExerciseDayRecordLabel} numberOfLines={1}>
                    {`ADD EXERCISE TO "${name}"`}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <Pressable
          style={globalStyles.addExerciseAddDayBar}
          onPress={() => {
            const query = new URLSearchParams({
              dayNames: serializeDayNames(dayNames),
              ...(programName ? { programName } : {}),
            }).toString();
            router.push(`/workout/create-day?${query}` as Href);
          }}
          accessibilityRole="button"
          accessibilityLabel="Add Day"
        >
          <Text style={globalStyles.createDayAccentBarLabel}>ADD DAY</Text>
        </Pressable>

        <View style={globalStyles.addExerciseSaveWrap}>
          <AppButton
            title={isSaving ? "Saving..." : "Save"}
            onPress={() => {
              void handleSave();
            }}
            borderColor={colors.white}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            pressAccentColor={colors.backArrow}
            style={globalStyles.workoutCreateProgramThinBorder}
          />
        </View>
      </ScrollView>
    </View>
  );
}
