import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { readSearchParam } from "@/components/app/program-day-params";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { WorkoutStartIcon } from "@/components/app/workout-start-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useUserPrograms } from "@/features/workout/user-programs";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const PRESET_WORKOUT_BUTTONS = [
  "Full Body Burn",
  "Full Strength",
] as const;

type ProgramButtonSelection =
  | { section: "your"; programId: string }
  | { section: "preset"; index: number };

function isYourSelection(
  selection: ProgramButtonSelection | null,
  programId: string,
) {
  return selection?.section === "your" && selection.programId === programId;
}

function isPresetSelection(
  selection: ProgramButtonSelection | null,
  index: number,
) {
  return selection?.section === "preset" && selection.index === index;
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
  const { programs, isLoading, error, refresh } = useUserPrograms();
  const [selectedButton, setSelectedButton] = useState<ProgramButtonSelection | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  function selectYourProgram(programId: string, programName: string) {
    setSelectedButton({ section: "your", programId });
    const query = new URLSearchParams({
      programId,
      programName,
      ...(showEdit ? { showEdit: "1" } : {}),
    }).toString();
    router.push(`/workout/program-day?${query}` as Href);
  }

  function selectPreset(index: number, programName: string) {
    setSelectedButton({ section: "preset", index });
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
        {isLoading ? (
          <Text style={globalStyles.startWorkoutYourPrograms}>Loading programs…</Text>
        ) : null}
        {error ? (
          <Text style={globalStyles.startWorkoutYourPrograms}>{error}</Text>
        ) : null}
        {!isLoading && !error && programs.length === 0 ? (
          <Text style={globalStyles.startWorkoutYourPrograms}>No programs yet</Text>
        ) : null}
        {programs.map((program) => (
          <ProgramButton
            key={program.id}
            title={program.name}
            selected={isYourSelection(selectedButton, program.id)}
            onPress={() => {
              selectYourProgram(program.id, program.name);
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
            selected={isPresetSelection(selectedButton, index)}
            onPress={() => {
              selectPreset(index, title);
            }}
          />
        ))}
      </View>
    </View>
  );
}
