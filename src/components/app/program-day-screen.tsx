import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { readSearchParam } from "@/components/app/program-day-params";
import { useAuth } from "@/features/auth/auth-context";
import { getProgram } from "@/features/workout/program-repository";
import type { ProgramDay } from "@/features/workout/types";
import { globalStyles, sizes, spacing } from "@/styles/global";

export function ProgramDayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    programId?: string | string[];
    programName?: string | string[];
    showEdit?: string | string[];
    fromHistory?: string | string[];
  }>();
  const programId = readSearchParam(params.programId);
  const programNameParam = readSearchParam(params.programName);
  const showEdit = readSearchParam(params.showEdit) === "1";
  const fromHistory = readSearchParam(params.fromHistory) === "1";

  const [days, setDays] = useState<ProgramDay[]>([]);
  const [programName, setProgramName] = useState(programNameParam ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user || !programId) {
      setDays([]);
      setError(programId ? null : "Missing program.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const program = await getProgram(user.uid, programId);
      if (!program) {
        setDays([]);
        setError("Program not found.");
        return;
      }

      setProgramName(program.name);
      setDays([...program.days].sort((a, b) => a.order - b.order));
    } catch (err) {
      setDays([]);
      setError(err instanceof Error ? err.message : "Failed to load program days.");
    } finally {
      setIsLoading(false);
    }
  }, [programId, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const programDaysLabel = programName ? `${programName} Days` : "Days";

  function openDay(day: ProgramDay) {
    const query = new URLSearchParams({
      dayName: day.name,
      ...(programId ? { programId } : {}),
      ...(programName ? { programName } : {}),
      ...(showEdit ? { showEdit: "1" } : {}),
      ...(fromHistory ? { fromHistory: "1" } : {}),
    }).toString();
    router.push(
      (fromHistory
        ? `/workout/workout-screen?${query}`
        : `/workout/program-day-exercise?${query}`) as Href,
    );
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
      {isLoading ? (
        <Text style={globalStyles.workoutMyPrograms}>Loading days…</Text>
      ) : null}
      {error ? <Text style={globalStyles.workoutMyPrograms}>{error}</Text> : null}
      {!isLoading && !error && days.length === 0 ? (
        <Text style={globalStyles.workoutMyPrograms}>No days yet</Text>
      ) : null}
      {days.map((day) => (
        <View key={day.id}>
          <View style={globalStyles.programDayDivider} />
          <Pressable
            onPress={() => {
              openDay(day);
            }}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel={day.name}
          >
            <Text style={globalStyles.programDayDayLabel}>{day.name}</Text>
          </Pressable>
        </View>
      ))}
      {days.length > 0 ? <View style={globalStyles.programDayDivider} /> : null}
    </View>
  );
}
