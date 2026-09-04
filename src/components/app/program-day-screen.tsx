import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { readSearchParam } from "@/components/app/program-day-params";
import { globalStyles, sizes, spacing } from "@/styles/global";

const PROGRAM_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export function ProgramDayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    programName?: string | string[];
    showEdit?: string | string[];
  }>();
  const programName = readSearchParam(params.programName);
  const showEdit = readSearchParam(params.showEdit) === "1";
  const programDaysLabel = programName ? `${programName} Days` : "Days";

  function openDay(day: number) {
    const query = new URLSearchParams({
      dayName: `Day ${day}`,
      ...(programName ? { programName } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
    }).toString();
    router.push(`/workout/program-day-exercise?${query}` as Href);
  }

  return (
    <View
      style={[
        globalStyles.programDayScreen,
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
          DAY
        </Text>
      </View>
      <Text style={globalStyles.programDayProgramName}>{programDaysLabel}</Text>
      {PROGRAM_DAYS.map((day) => (
        <View key={day}>
          <View style={globalStyles.programDayDivider} />
          <Pressable
            onPress={() => {
              openDay(day);
            }}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel={`Day ${day}`}
          >
            <Text style={globalStyles.programDayDayLabel}>{`Day ${day}`}</Text>
          </Pressable>
        </View>
      ))}
      <View style={globalStyles.programDayDivider} />
    </View>
  );
}
