import { useRouter, type Href } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useUserPrograms, type UserProgram } from "@/features/workout/user-programs";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const HISTORY_DATE = "JUL 11, 2025";

type HistoryEntry = {
  programName: string;
  dayName: string;
  date: string;
};

const FALLBACK_HISTORY: HistoryEntry[] = [
  { programName: "PROGRAM'S NAME", dayName: "DAY NAME", date: HISTORY_DATE },
  { programName: "PROGRAM'S NAME", dayName: "DAY NAME", date: HISTORY_DATE },
  { programName: "PROGRAM'S NAME", dayName: "DAY NAME", date: HISTORY_DATE },
  { programName: "PROGRAM'S NAME", dayName: "DAY NAME", date: HISTORY_DATE },
];

function historyEntriesFromPrograms(programs: UserProgram[]): HistoryEntry[] {
  if (programs.length === 0) {
    return FALLBACK_HISTORY;
  }

  return programs.flatMap((program) => {
    const dayNames = program.dayNames.length > 0 ? program.dayNames : ["DAY NAME"];
    return dayNames.map((dayName) => ({
      programName: program.name,
      dayName,
      date: HISTORY_DATE,
    }));
  });
}

export function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const userPrograms = useUserPrograms();
  const historyEntries = historyEntriesFromPrograms(userPrograms);

  function openProgram(programName: string, dayName: string) {
    const query = new URLSearchParams({
      programName,
      dayName,
      fromHistory: "1",
    }).toString();
    router.push(`/workout/program-day-exercise?${query}` as Href);
  }

  return (
    <View
      style={[
        globalStyles.historyScreen,
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
              if (router.canGoBack()) {
                router.back();
                return;
              }

              router.navigate("/workout" as Href);
            }}
          />
        </View>
        <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
          HISTORY
        </Text>
      </View>
      <ScrollView
        style={globalStyles.progressScreenScroll}
        contentContainerStyle={globalStyles.historyButtons}
        showsVerticalScrollIndicator={false}
      >
        {historyEntries.map((entry, index) => {
          const title = `${entry.programName} | ${entry.dayName}`;

          return (
            <AppButton
              key={`${entry.programName}-${entry.dayName}-${index}`}
              title={title}
              onPress={() => {
                openProgram(entry.programName, entry.dayName);
              }}
              borderColor={colors.white}
              borderWidth={sizes.workoutProgramThinBorderWidth}
              textColor={colors.inputFill}
              textStyle={globalStyles.historyButtonText}
              style={globalStyles.historyButton}
              pressAccentColor={colors.backArrow}
              rightIcon={<Text style={globalStyles.historyButtonText}>{entry.date}</Text>}
              accessibilityLabel={`${title} ${entry.date}`}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
