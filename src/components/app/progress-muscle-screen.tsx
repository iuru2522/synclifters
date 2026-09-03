import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { readSearchParam } from "@/components/app/program-day-params";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { globalStyles, sizes, spacing } from "@/styles/global";

const TRICEPS_EXERCISES = Array.from({ length: 11 }, () => "BARBELL BENCH PRESS");

export function ProgressMuscleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    muscleGroup?: string | string[];
  }>();
  const muscleGroup = readSearchParam(params.muscleGroup) ?? "Triceps";

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
          {muscleGroup.toUpperCase()}
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
        style={globalStyles.progressMuscleScroll}
        contentContainerStyle={globalStyles.progressMuscleScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.progressMuscleExerciseList}>
          {TRICEPS_EXERCISES.map((exerciseName, index) => (
            <View key={`${exerciseName}-${index}`} style={globalStyles.doExerciseItem}>
              <Pressable
                style={globalStyles.doExerciseSelectTarget}
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel={exerciseName}
              >
                <View style={globalStyles.doExerciseCircle} />
                <Text style={globalStyles.doExerciseName} numberOfLines={1}>
                  {exerciseName}
                </Text>
              </Pressable>
              <ProfileActionArrow />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
