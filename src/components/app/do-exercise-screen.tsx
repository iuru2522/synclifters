import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useAuth } from "@/features/auth/auth-context";
import { addExerciseToDay, catalogExerciseId } from "@/features/workout/day-exercises";
import { addExerciseToProgramDay } from "@/features/workout/program-repository";
import type { ProgramExercise } from "@/features/workout/types";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const TRICEPS_EXERCISES = [
  "Tricep Pushdown",
  "Skull Crushers",
  "Close Grip Bench Press",
  "Overhead Tricep Extension",
] as const;

export function DoExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    muscleGroup?: string | string[];
    programId?: string | string[];
    programName?: string | string[];
    dayName?: string | string[];
    dayNames?: string | string[];
  }>();
  const muscleGroup = readSearchParam(params.muscleGroup) ?? "";
  const programId = readSearchParam(params.programId);
  const programName = readSearchParam(params.programName);
  const dayName = readSearchParam(params.dayName);
  const dayNames = readSearchParam(params.dayNames);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectExercise = async (exerciseName: string) => {
    if (isSaving) {
      return;
    }

    const exerciseId = catalogExerciseId(exerciseName);
    const exercise: ProgramExercise = {
      id: `pe_${exerciseId}`,
      exerciseId,
      name: exerciseName,
      source: "catalog",
      muscleGroup: muscleGroup || "Triceps",
      measure: null,
      repType: "regular",
      dropsetLvls: null,
      supersetExerciseName: null,
      imageUrl: null,
    };

    if (programId) {
      if (!dayName) {
        Alert.alert("Day required", "Open add exercise from a program day.");
        return;
      }

      if (!user) {
        Alert.alert("Sign in required", "Sign in to add an exercise to this program.");
        return;
      }

      setIsSaving(true);
      try {
        await addExerciseToProgramDay(user.uid, programId, dayName, exercise);
        const query = new URLSearchParams({
          programId,
          dayName,
          ...(programName ? { programName } : {}),
        }).toString();
        router.dismissTo(`/workout/program-day-exercise?${query}` as Href);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add exercise.";
        Alert.alert("Add failed", message);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (dayName) {
      addExerciseToDay(dayName, exercise);
    }

    router.dismissTo({
      pathname: "/workout/add-exercise-to-day",
      params: {
        ...(programName ? { programName } : {}),
        ...(dayNames ? { dayNames } : {}),
      },
    } as Href);
  };

  return (
    <View style={globalStyles.createProgramScreen}>
      <View
        style={{
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
        }}
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
            {muscleGroup}
          </Text>
          <Pressable
            style={globalStyles.createDayHeaderMenu}
            onPress={() => {
              router.push({
                pathname: "/workout/custom-exercise",
                params: {
                  ...(programId ? { programId } : {}),
                  ...(programName ? { programName } : {}),
                  ...(dayName ? { dayName } : {}),
                  ...(dayNames ? { dayNames } : {}),
                },
              } as Href);
            }}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <CreateDayBurgerIcon />
          </Pressable>
        </View>

        <View style={globalStyles.doExerciseCirclesRow}>
          {TRICEPS_EXERCISES.map((name) => (
            <View key={name} style={globalStyles.doExerciseItem}>
              <Pressable
                style={globalStyles.doExerciseSelectTarget}
                onPress={() => {
                  void handleSelectExercise(name);
                }}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel={name}
              >
                <View style={globalStyles.doExerciseCircle} />
                <Text style={globalStyles.doExerciseName} numberOfLines={1}>
                  {name}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/workout/exercise-history",
                    params: { exerciseName: name },
                  } as Href);
                }}
                hitSlop={sizes.backArrowHitSlop}
                accessibilityRole="button"
                accessibilityLabel={`${name} history`}
              >
                <WorkoutExternalLinkIcon color={colors.backArrow} />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
