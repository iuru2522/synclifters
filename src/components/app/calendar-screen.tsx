import {
  Calendar,
  toDateId,
  useCalendar,
  type CalendarActiveDateRange,
  type CalendarDayMetadata,
  type CalendarOnDayPress,
} from "@marceloterreiro/flash-calendar";
import { differenceInCalendarWeeks, format, startOfWeek } from "date-fns";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState, type ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useUserSessions } from "@/features/workout/user-sessions";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function FlameStreakIcon() {
  return (
    <Svg
      width={sizes.calendarFlameIconWidth}
      height={sizes.calendarFlameIconHeight}
      viewBox="0 0 16 20"
      fill="none"
    >
      <Path
        d="M8.86 0.64C8.55 0.25 7.93 0.42 7.86 0.91C7.52 3.28 5.95 4.86 4.42 6.41C2.82 8.03 1.25 9.62 1.25 12.55C1.25 16.39 4.27 19.5 8 19.5C11.73 19.5 14.75 16.39 14.75 12.55C14.75 9.33 12.88 6.41 11.45 4.65C11.12 4.25 10.48 4.45 10.44 4.97C10.35 6.01 9.86 6.84 9.28 7.3C9.02 7.51 8.63 7.34 8.66 7.01C8.86 4.69 10.02 2.11 8.86 0.64Z"
        fill={colors.calendarFlameOuter}
      />
      <Path
        d="M8.02 10.2C7.42 11.22 6.4 11.98 5.72 13.06C5.26 13.79 5 14.62 5 15.52C5 17.18 6.34 18.5 8 18.5C9.66 18.5 11 17.18 11 15.52C11 13.72 9.65 11.88 8.58 10.22C8.32 9.82 7.77 9.8 8.02 10.2Z"
        fill={colors.calendarFlameInner}
      />
    </Svg>
  );
}

function dayContainerStyle(state: CalendarDayMetadata["state"]) {
  if (state === "active") {
    return globalStyles.calendarDayActiveContainer;
  }
  if (state === "today") {
    return globalStyles.calendarDayTodayContainer;
  }
  return globalStyles.calendarDayBaseContainer;
}

function dayTextStyle(state: CalendarDayMetadata["state"]) {
  if (state === "active") {
    return globalStyles.calendarDayActiveText;
  }
  if (state === "today") {
    return globalStyles.calendarDayTodayText;
  }
  return globalStyles.calendarDayText;
}

const CalendarTrainingDay = memo(function CalendarTrainingDay({
  day,
  isTrainingDay,
  onPress,
}: {
  day: CalendarDayMetadata;
  isTrainingDay: boolean;
  onPress: CalendarOnDayPress;
}) {
  const label = useMemo(() => format(day.date, "EEEE, MMMM d"), [day.date]);

  return (
    <Pressable
      style={[globalStyles.calendarDayCell, dayContainerStyle(day.state)]}
      onPress={() => {
        onPress(day.id);
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: day.state === "active" }}
      accessibilityLabel={isTrainingDay ? `${label}, training day` : label}
    >
      <Text style={dayTextStyle(day.state)}>{day.displayLabel}</Text>
      {isTrainingDay ? (
        <View style={globalStyles.calendarTrainingDot} />
      ) : (
        <View style={globalStyles.calendarTrainingDotSpacer} />
      )}
    </Pressable>
  );
});

const TrainingCalendarMonth = memo(function TrainingCalendarMonth({
  calendarMonthId,
  calendarFirstDayOfWeek = "sunday",
  calendarActiveDateRanges,
  onCalendarDayPress,
  trainingDateIds,
}: {
  calendarMonthId: string;
  calendarFirstDayOfWeek?: "sunday" | "monday";
  calendarActiveDateRanges?: CalendarActiveDateRange[];
  onCalendarDayPress: CalendarOnDayPress;
  trainingDateIds: ReadonlySet<string>;
}) {
  const calendarParams = useMemo(
    () => ({
      calendarMonthId,
      calendarFirstDayOfWeek,
      calendarActiveDateRanges,
    }),
    [calendarActiveDateRanges, calendarFirstDayOfWeek, calendarMonthId],
  );
  const { calendarRowMonth, weeksList } = useCalendar(calendarParams);
  const monthTitle =
    calendarRowMonth.charAt(0).toUpperCase() + calendarRowMonth.slice(1);

  return (
    <View>
      <View style={[globalStyles.calendarMonthRowContainer, globalStyles.calendarMonthHeader]}>
        <Text style={globalStyles.calendarMonthRowTitle}>{monthTitle}</Text>
      </View>
      {weeksList.map((week) => (
        <View key={week[0]?.id ?? calendarMonthId} style={globalStyles.calendarWeekRow}>
          {week.map((day) =>
            day.isDifferentMonth ? (
              <View key={day.id} style={globalStyles.calendarDayCell} />
            ) : (
              <CalendarTrainingDay
                key={day.id}
                day={day}
                isTrainingDay={trainingDateIds.has(day.id)}
                onPress={onCalendarDayPress}
              />
            ),
          )}
        </View>
      ))}
    </View>
  );
});

function computeWeekStreak(activityDates: Date[]): number {
  if (activityDates.length === 0) {
    return 0;
  }

  const weekStarts = new Set<number>();
  for (const date of activityDates) {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 }).getTime();
    weekStarts.add(weekStart);
  }

  const sortedWeeks = Array.from(weekStarts)
    .sort((a, b) => b - a)
    .map((ts) => new Date(ts));

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const mostRecentWeek = sortedWeeks[0];
  const weeksFromNow = differenceInCalendarWeeks(currentWeekStart, mostRecentWeek, {
    weekStartsOn: 0,
  });

  if (weeksFromNow > 1) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedWeeks.length; i += 1) {
    const diff = differenceInCalendarWeeks(sortedWeeks[i - 1], sortedWeeks[i], {
      weekStartsOn: 0,
    });
    if (diff === 1) {
      streak += 1;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
}

export function CalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activityDates } = useUserSessions();
  const initialDateId = useMemo(() => toDateId(new Date()), []);
  const [selectedDateId, setSelectedDateId] = useState<string>(initialDateId);

  const weekStreak = useMemo(() => computeWeekStreak(activityDates), [activityDates]);

  const trainingDateIds = useMemo(() => {
    const ids = new Set<string>();
    for (const date of activityDates) {
      ids.add(toDateId(date));
    }
    return ids;
  }, [activityDates]);

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(() => {
    if (!selectedDateId) {
      return [];
    }
    return [{ startId: selectedDateId, endId: selectedDateId }];
  }, [selectedDateId]);

  const handleDayPress = useCallback<CalendarOnDayPress>((dateId) => {
    setSelectedDateId(dateId);
  }, []);

  const renderMonthItem = useCallback<
    NonNullable<ComponentProps<typeof Calendar.List>["renderItem"]>
  >(
    ({ item }) => (
      <View style={globalStyles.calendarMonthListItem}>
        <TrainingCalendarMonth
          calendarActiveDateRanges={item.calendarProps.calendarActiveDateRanges}
          calendarFirstDayOfWeek={item.calendarProps.calendarFirstDayOfWeek}
          calendarMonthId={item.id}
          onCalendarDayPress={item.calendarProps.onCalendarDayPress}
          trainingDateIds={trainingDateIds}
        />
      </View>
    ),
    [trainingDateIds],
  );

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
        <Text style={globalStyles.createDayHeaderTitle}>Calendar</Text>
      </View>

      <View style={globalStyles.calendarTopBar}>
        <View
          style={globalStyles.calendarStreakRow}
          accessibilityLabel={`${weekStreak} week streak`}
        >
          <FlameStreakIcon />
          <Text style={globalStyles.calendarStreakText}>{weekStreak} week streak</Text>
        </View>

        <View style={globalStyles.calendarWeekHeaderWrap}>
          <Calendar.Row.Week spacing={0}>
            {WEEK_DAYS.map((dayName) => (
              <Calendar.Item.WeekName
                key={dayName}
                height={sizes.calendarWeekHeaderHeight}
                theme={{
                  content: globalStyles.calendarWeekHeaderContent,
                }}
              >
                {dayName}
              </Calendar.Item.WeekName>
            ))}
          </Calendar.Row.Week>
        </View>
      </View>

      <View style={globalStyles.calendarListWrap}>
        <Calendar.List
          calendarInitialMonthId={initialDateId}
          calendarFirstDayOfWeek="sunday"
          calendarColorScheme="dark"
          calendarPastScrollRangeInMonths={12}
          calendarFutureScrollRangeInMonths={12}
          calendarDayHeight={sizes.calendarDayCellHeight}
          calendarMonthHeaderHeight={sizes.calendarMonthHeaderHeight}
          calendarWeekHeaderHeight={0}
          calendarRowVerticalSpacing={0}
          calendarRowHorizontalSpacing={0}
          calendarSpacing={spacing.calendarMonthSpacing}
          calendarActiveDateRanges={calendarActiveDateRanges}
          onCalendarDayPress={handleDayPress}
          extraData={trainingDateIds}
          renderItem={renderMonthItem}
          contentContainerStyle={globalStyles.calendarListContent}
        />
      </View>
    </View>
  );
}
