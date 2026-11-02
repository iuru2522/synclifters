import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseSessionHistoryList } from "@/components/app/exercise-session-history-list";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { catalogExerciseId } from "@/features/workout/day-exercises";
import { readSearchParam } from "@/features/workout/nav-params";
import { useExerciseSessionHistory } from "@/features/workout/user-exercise-history";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { globalStyles, sizes, spacing } from "@/styles/global";

const exerciseImage = require("../../../assets/images/exercise.png");

export function ExerciseHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const params = useLocalSearchParams<{
    exerciseName?: string | string[];
    exerciseId?: string | string[];
  }>();
  const exerciseName = readSearchParam(params.exerciseName) ?? "";
  const exerciseId =
    readSearchParam(params.exerciseId) ||
    (exerciseName ? catalogExerciseId(exerciseName) : "");
  const { sessions, isLoading, error, refresh } = useExerciseSessionHistory(exerciseId);
  const imageHeight =
    (windowWidth * sizes.exerciseHistoryImageHeight) / sizes.exerciseHistoryImageWidth;

  useRefreshOnFocus(refresh);

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
            style={globalStyles.exerciseHistoryBackButton}
            onPress={() => {
              router.back();
            }}
          />
        </View>
        <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
          {exerciseName}
        </Text>
      </View>

      <ScrollView
        style={globalStyles.addExerciseScreenScroll}
        contentContainerStyle={globalStyles.addExerciseScreenScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={exerciseImage}
          style={[
            globalStyles.exerciseHistoryImage,
            { width: windowWidth, height: imageHeight },
          ]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <ExerciseSessionHistoryList
          sessions={sessions}
          exerciseId={exerciseId}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>
    </View>
  );
}
