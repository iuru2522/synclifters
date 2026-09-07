import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { addExerciseToDay, catalogExerciseId } from "@/features/workout/day-exercises";
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
  const params = useLocalSearchParams<{
    muscleGroup?: string | string[];
    programName?: string | string[];
    dayName?: string | string[];
    dayNames?: string | string[];
  }>();
  const muscleGroup = readSearchParam(params.muscleGroup) ?? "";
  const programName = readSearchParam(params.programName);
  const dayName = readSearchParam(params.dayName);
  const dayNames = readSearchParam(params.dayNames);

  const handleSelectExercise = (exerciseName: string) => {
    if (dayName) {
      const exerciseId = catalogExerciseId(exerciseName);
      addExerciseToDay(dayName, {
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
      });
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
                  handleSelectExercise(name);
                }}
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
