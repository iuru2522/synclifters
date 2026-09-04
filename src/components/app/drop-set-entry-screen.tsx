import { useState } from "react";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { ChevronDownIcon } from "@/components/app/chevron-down-icon";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { readSearchParam } from "@/components/app/program-day-params";
import { SaveExerciseOverlay } from "@/components/app/save-exercise-overlay";
import { SetFeelingBar, type SetFeeling } from "@/components/app/set-feeling-bar";
import { SetNumericInput } from "@/components/app/set-numeric-input";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { setRecordedDropSets } from "@/features/workout/recorded-drop-sets";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

type DropSetRow = {
  weight: string;
  reps: string;
};

const EMPTY_DROP: DropSetRow = { weight: "00.0", reps: "10" };
const MAX_DROPS = 10;

export function DropSetEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [drops, setDrops] = useState<DropSetRow[]>([{ ...EMPTY_DROP }]);
  const [dropSetFeeling, setDropSetFeeling] = useState<SetFeeling>("W");
  const [saveExerciseVisible, setSaveExerciseVisible] = useState(false);
  const params = useLocalSearchParams<{
    exerciseName?: string | string[];
    dayName?: string | string[];
    programName?: string | string[];
  }>();
  const exerciseName = readSearchParam(params.exerciseName);
  const dayName = readSearchParam(params.dayName);
  const programName = readSearchParam(params.programName);

  function finishExercise() {
    setRecordedDropSets(drops);
    setSaveExerciseVisible(false);
    const query = new URLSearchParams({
      ...(programName ? { programName } : {}),
      ...(dayName ? { dayName } : {}),
      ...(exerciseName ? { exerciseName } : {}),
    }).toString();
    router.replace(
      (query ? `/workout/workout-screen?${query}` : "/workout/workout-screen") as Href,
    );
  }

  return (
    <View style={globalStyles.workoutScreen}>
      <View
        style={[
          globalStyles.workoutScreen,
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
          DROP SET
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
        style={globalStyles.workoutScreenScroll}
        contentContainerStyle={[
          globalStyles.workoutScreenScrollContent,
          {
            paddingBottom: Math.max(insets.bottom, spacing.safeAreaBottomMin),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {drops.map((drop, index) => (
          <View key={`drop-${index}`}>
            <View
              style={[
                globalStyles.dropSetIndexBar,
                index === 0 ? globalStyles.dropSetIndexBarFirst : null,
              ]}
            >
              <Text style={globalStyles.createDayAccentBarLabel}>{index + 1}</Text>
            </View>
            <View style={globalStyles.dropSetWeightLabelRow}>
              <Text style={globalStyles.setScreenWeightLabel}>WEIGHT | KG</Text>
              <Pressable
                onPress={() => {}}
                hitSlop={sizes.backArrowHitSlop}
                accessibilityRole="button"
                accessibilityLabel="Weight unit"
              >
                <ChevronDownIcon />
              </Pressable>
            </View>
            <SetNumericInput
              value={drop.weight}
              onChangeText={(value) => {
                setDrops((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, weight: value } : row,
                  ),
                );
              }}
              keyboardType="decimal-pad"
              accessibilityLabel={`Drop ${index + 1} weight`}
            />
            <View style={globalStyles.setScreenWeightLine} />
            <Text style={[globalStyles.setScreenWeightLabel, globalStyles.setScreenRepsLabel]}>
              REPS
            </Text>
            <SetNumericInput
              value={drop.reps}
              onChangeText={(value) => {
                setDrops((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, reps: value } : row,
                  ),
                );
              }}
              keyboardType="number-pad"
              accessibilityLabel={`Drop ${index + 1} reps`}
            />
            <View style={globalStyles.setScreenWeightLine} />
          </View>
        ))}
        {drops.length < MAX_DROPS ? (
          <Pressable
            style={globalStyles.dropSetAddDropLink}
            onPress={() => {
              setDrops((current) =>
                current.length >= MAX_DROPS ? current : [...current, { ...EMPTY_DROP }],
              );
            }}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Add Drop"
          >
            <Text style={globalStyles.setScreenDropSetLabel}>Add Drop</Text>
          </Pressable>
        ) : null}
        <Text style={globalStyles.dropSetFeelingLabel}>DROP SET FEELING</Text>
        <SetFeelingBar value={dropSetFeeling} onChange={setDropSetFeeling} />
        <View style={globalStyles.dropSetFooter}>
          <View style={globalStyles.setScreenRecordWrap}>
            <AppButton
              title="RECORD"
              onPress={() => {
                setSaveExerciseVisible(true);
              }}
              borderColor={colors.backArrow}
              textColor={colors.inputFill}
              pressAccentColor={colors.backArrow}
            />
          </View>
        </View>
      </ScrollView>
      </View>
      <SaveExerciseOverlay
        visible={saveExerciseVisible}
        finishTitle="FINISH EXERCISE"
        onFinish={finishExercise}
        onCancel={() => {
          setSaveExerciseVisible(false);
        }}
      />
    </View>
  );
}
