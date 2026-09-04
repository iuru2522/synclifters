import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { readSearchParam } from "@/components/app/program-day-params";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { WorkoutStartIcon } from "@/components/app/workout-start-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const YOUR_PROGRAM_BUTTONS = [
  "Full Body Strength",
  "Full Body Strength",
  "Full Body Strength",
  "Full Body Strength",
] as const;

const PRESET_WORKOUT_BUTTONS = [
  "Full Body Strength",
  "Full Body Strength",
  "Full Body Strength",
  "Full Body Strength",
] as const;

type ProgramButtonSelection =
  | { section: "your"; index: number }
  | { section: "preset"; index: number };

function isSelection(
  selection: ProgramButtonSelection | null,
  section: ProgramButtonSelection["section"],
  index: number,
) {
  return selection?.section === section && selection.index === index;
}

function ProgramButton({
  title,
  selected,
  onPress,
  subtitle,
  subtitleMeta,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
  subtitle?: string;
  subtitleMeta?: string;
}) {
  const accent = selected ? colors.backArrow : colors.white;

  return (
    <AppButton
      title={title}
      subtitle={subtitle}
      subtitleMeta={subtitleMeta}
      onPress={onPress}
      borderColor={accent}
      borderWidth={sizes.workoutProgramThinBorderWidth}
      textColor={colors.inputFill}
      textStyle={globalStyles.startWorkoutProgramButtonText}
      subtitleStyle={globalStyles.startWorkoutProgramButtonSubtitle}
      subtitleMetaStyle={globalStyles.startWorkoutProgramButtonSubtitleMeta}
      style={globalStyles.startWorkoutProgramButton}
      leftIcon={<WorkoutExternalLinkIcon color={accent} />}
      rightIcon={
        <WorkoutStartIcon variant={selected ? "filled" : "outline"} color={accent} />
      }
    />
  );
}

export function StartWorkoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ showEdit?: string | string[] }>();
  const showEdit = readSearchParam(params.showEdit) === "1";
  const [selectedButton, setSelectedButton] = useState<ProgramButtonSelection | null>(null);

  function selectProgram(
    selection: ProgramButtonSelection,
    programName: string,
  ) {
    setSelectedButton(selection);
    const query = new URLSearchParams({
      programName,
      ...(showEdit ? { showEdit: "1" } : {}),
    }).toString();
    router.push(`/workout/program-day?${query}` as Href);
  }

  return (
    <View
      style={[
        globalStyles.startWorkoutScreen,
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
        <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
          PROGRAMS
        </Text>
      </View>
      <Text style={globalStyles.startWorkoutYourPrograms}>Your programs</Text>
      <View style={globalStyles.workoutCreateProgramButton}>
        {YOUR_PROGRAM_BUTTONS.map((title, index) => (
          <ProgramButton
            key={`your-program-${index}`}
            title={title}
            selected={isSelection(selectedButton, "your", index)}
            onPress={() => {
              selectProgram({ section: "your", index }, title);
            }}
          />
        ))}
      </View>
      <Text style={globalStyles.startWorkoutPresetWorkouts}>Preset Workouts</Text>
      <View style={globalStyles.workoutCreateProgramButton}>
        {PRESET_WORKOUT_BUTTONS.map((title, index) => (
          <ProgramButton
            key={`preset-workout-${index}`}
            title={title}
            subtitle="3 Days/Week"
            subtitleMeta="Advanced"
            selected={isSelection(selectedButton, "preset", index)}
            onPress={() => {
              selectProgram({ section: "preset", index }, title);
            }}
          />
        ))}
      </View>
    </View>
  );
}
