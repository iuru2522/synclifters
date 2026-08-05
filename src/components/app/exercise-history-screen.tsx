import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const exerciseImage = require("../../../assets/images/exercise.png");

const historyEntries = [
  "Jul 11, 2025",
  "Jun 28, 2025",
  "May 3, 2025",
  "Apr 19, 2025",
  "Mar 7, 2025",
] as const;

export function ExerciseHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const params = useLocalSearchParams<{
    exerciseName?: string | string[];
  }>();
  const exerciseName = readSearchParam(params.exerciseName) ?? "";
  const imageHeight =
    (windowWidth * sizes.exerciseHistoryImageHeight) / sizes.exerciseHistoryImageWidth;

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
          {exerciseName}
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
        <Text style={globalStyles.exerciseHistoryLabel}>HISTORY</Text>
        <View style={globalStyles.exerciseHistoryButtonsRow}>
          {historyEntries.map((date) => (
            <AppButton
              key={date}
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
                    <Text style={globalStyles.exerciseHistoryButtonDate}>{date}</Text>
                    <Text style={globalStyles.exerciseHistoryButtonProgram}>
                      DAY NAME - PROGRAM'S NAME
                    </Text>
                  </View>
                  <View style={globalStyles.exerciseHistoryButtonRow}>
                    <Text style={globalStyles.exerciseHistoryButtonDate}>
                      25X10, 35X6, 45X4, 59X7, 59X8
                    </Text>
                    <Text style={globalStyles.exerciseHistoryButtonWeight}>1200 Kgs</Text>
                  </View>
                </View>
              }
              style={[
                globalStyles.workoutCreateProgramThinBorder,
                globalStyles.exerciseHistoryButton,
              ]}
              accessibilityLabel={`${date}, 25X10, 35X6, 45X4, 59X7, 59X8, DAY NAME - PROGRAM'S NAME, 1200 Kgs`}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
