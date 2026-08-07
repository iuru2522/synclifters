import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { readSearchParam } from "@/components/app/program-day-params";
import { colors, globalStyles, spacing } from "@/styles/global";

const EXERCISES = [
  "Tricep Pushdown",
  "Barbell Bench Press",
  "Lat Pulldown",
  "Romanian Deadlift",
  "Shoulder Press",
  "Cable Fly",
] as const;

export function ProgramDayExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    dayName?: string | string[];
  }>();
  const dayName = readSearchParam(params.dayName);

  return (
    <View
      style={[
        globalStyles.programDayExerciseScreen,
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
              router.back();
            }}
          />
        </View>
        {dayName ? (
          <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
            {dayName}
          </Text>
        ) : null}
      </View>
      <View style={globalStyles.programDayExerciseCirclesRow}>
        {EXERCISES.map((name) => (
          <View key={name} style={globalStyles.doExerciseItem}>
            <View style={globalStyles.doExerciseSelectTarget}>
              <View style={globalStyles.doExerciseCircle} />
              <Text style={globalStyles.programDayExerciseName} numberOfLines={1}>
                {name}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={globalStyles.programDayExerciseSelectDayWrap}>
        <AppButton
          title="SELECT DAY"
          onPress={() => {}}
          borderColor={colors.backArrow}
          textColor={colors.inputFill}
          pressAccentColor={colors.backArrow}
        />
      </View>
    </View>
  );
}
