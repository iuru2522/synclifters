import { isSameDay } from "date-fns";
import { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from "react-native";
import { DayCard } from "./DayCard";
import { styles } from "./styles";
import type { WeekCalendarProps, WeekPage } from "./types";
import { dateKey, useWeek } from "./useWeek";

export function WeekCalendar({
  selectedDate,
  onDateChange,
  weekStartsOn = 0,
  activityDates,
}: WeekCalendarProps) {
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<WeekPage>>(null);
  const isScrollingRef = useRef(false);

  const { today, weeks, selectedWeekIndex, initialWeekIndex, hasActivity } = useWeek({
    selectedDate,
    weekStartsOn,
    activityDates,
  });

  useEffect(() => {
    if (selectedWeekIndex < 0 || isScrollingRef.current) {
      return;
    }

    listRef.current?.scrollToIndex({
      index: selectedWeekIndex,
      animated: true,
    });
  }, [selectedWeekIndex]);

  const onDayPress = useCallback(
    (date: Date) => {
      onDateChange(date);
    },
    [onDateChange],
  );

  const renderWeek: ListRenderItem<WeekPage> = useCallback(
    ({ item }) => (
      <View style={[styles.weekPage, { width: windowWidth }]}>
        {item.days.map((day) => (
          <DayCard
            key={dateKey(day)}
            date={day}
            selected={isSameDay(day, selectedDate)}
            hasActivity={hasActivity(day)}
            isToday={isSameDay(day, today)}
            onPress={onDayPress}
          />
        ))}
      </View>
    ),
    [hasActivity, onDayPress, selectedDate, today, windowWidth],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<WeekPage> | null | undefined, index: number) => ({
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }),
    [windowWidth],
  );

  const onMomentumScrollBegin = useCallback(() => {
    isScrollingRef.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
      isScrollingRef.current = false;

      const week = weeks[index];
      if (!week) {
        return;
      }

      const stillInWeek = week.days.some((day) => isSameDay(day, selectedDate));
      if (!stillInWeek) {
        const matchedDay =
          week.days.find((day) => day.getDay() === selectedDate.getDay()) ?? week.days[0];
        if (matchedDay) {
          onDateChange(matchedDay);
        }
      }
    },
    [onDateChange, selectedDate, weeks, windowWidth],
  );

  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      data={weeks}
      keyExtractor={(item) => item.key}
      renderItem={renderWeek}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialWeekIndex}
      getItemLayout={getItemLayout}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onScrollToIndexFailed={(info) => {
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex({
            index: info.index,
            animated: false,
          });
        });
      }}
      decelerationRate="fast"
      nestedScrollEnabled
      windowSize={5}
      maxToRenderPerBatch={3}
      initialNumToRender={3}
    />
  );
}
