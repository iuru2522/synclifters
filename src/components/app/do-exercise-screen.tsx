import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { SaveExerciseOverlay } from "@/components/app/save-exercise-overlay";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useAuth } from "@/features/auth/auth-context";
import { listCatalogExercisesForMuscle } from "@/features/workout/catalog-repository";
import {
  MUSCLE_GROUP_OPTIONS,
  setSelectedMuscleGroup,
  type MuscleGroup,
} from "@/features/workout/custom-exercise-muscle";
import { addExerciseToDay, catalogExerciseId } from "@/features/workout/day-exercises";
import type { CatalogExercise } from "@/features/workout/exercise-catalog";
import { catalogExercisesForMuscle } from "@/features/workout/exercise-catalog";
import { addExerciseToProgramDay } from "@/features/workout/program-repository";
import type { ProgramExercise } from "@/features/workout/types";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

function asMuscleGroup(value: string): MuscleGroup | null {
  return (MUSCLE_GROUP_OPTIONS as readonly string[]).includes(value)
    ? (value as MuscleGroup)
    : null;
}

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
  const [exercises, setExercises] = useState<CatalogExercise[]>(() =>
    catalogExercisesForMuscle(muscleGroup),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void (async () => {
        setIsLoading(true);
        try {
          const next = await listCatalogExercisesForMuscle(muscleGroup);
          if (active) {
            setExercises(next);
          }
        } finally {
          if (active) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        active = false;
      };
    }, [muscleGroup]),
  );

  const handleSelectExercise = async (exercise: CatalogExercise) => {
    if (isSaving) {
      return;
    }

    const programExercise: ProgramExercise = {
      id: `pe_${exercise.id}`,
      exerciseId: exercise.id || catalogExerciseId(exercise.name),
      name: exercise.name,
      source: "catalog",
      muscleGroup: muscleGroup || exercise.muscleGroup,
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
        await addExerciseToProgramDay(user.uid, programId, dayName, programExercise);
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
      addExerciseToDay(dayName, programExercise);
    }

    const query = new URLSearchParams({
      ...(programName ? { programName } : {}),
      ...(dayNames ? { dayNames } : {}),
    }).toString();
    router.dismissTo(
      (query
        ? `/workout/add-exercise-to-day?${query}`
        : "/workout/add-exercise-to-day") as Href,
    );
  };

  return (
    <View style={globalStyles.createProgramScreen}>
      <View
        style={{
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
          flex: 1,
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
              setMenuVisible(true);
            }}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <CreateDayBurgerIcon />
          </Pressable>
        </View>

        <ScrollView
          style={globalStyles.addExerciseScreenScroll}
          contentContainerStyle={globalStyles.doExerciseCirclesRow}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && exercises.length === 0 ? (
            <Text style={globalStyles.workoutMyPrograms}>Loading exercises…</Text>
          ) : null}
          {!isLoading && exercises.length === 0 ? (
            <Text style={globalStyles.workoutMyPrograms}>No exercises yet</Text>
          ) : null}
          {exercises.map((exercise) => (
            <View key={exercise.id} style={globalStyles.doExerciseItem}>
              <Pressable
                style={globalStyles.doExerciseSelectTarget}
                onPress={() => {
                  void handleSelectExercise(exercise);
                }}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel={exercise.name}
              >
                <View style={globalStyles.doExerciseCircle} />
                <Text style={globalStyles.doExerciseName} numberOfLines={1}>
                  {exercise.name}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const query = new URLSearchParams({
                    exerciseName: exercise.name,
                    exerciseId: exercise.id,
                  }).toString();
                  router.push(`/workout/exercise-history?${query}` as Href);
                }}
                hitSlop={sizes.backArrowHitSlop}
                accessibilityRole="button"
                accessibilityLabel={`${exercise.name} history`}
              >
                <WorkoutExternalLinkIcon color={colors.backArrow} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
      <SaveExerciseOverlay
        visible={menuVisible}
        finishTitle="Create Custom Exercise"
        onFinish={() => {
          const muscle = asMuscleGroup(muscleGroup);
          if (muscle) {
            setSelectedMuscleGroup(muscle);
          }

          const query = new URLSearchParams({
            ...(programId ? { programId } : {}),
            ...(programName ? { programName } : {}),
            ...(dayName ? { dayName } : {}),
            ...(dayNames ? { dayNames } : {}),
            ...(muscleGroup ? { muscleGroup } : {}),
          }).toString();
          const href = (
            query
              ? `/workout/custom-exercise?${query}`
              : "/workout/custom-exercise"
          ) as Href;

          setMenuVisible(false);
          router.push(href);
        }}
        onCancel={() => {
          setMenuVisible(false);
        }}
      />
    </View>
  );
}
