import { format } from "date-fns";
import { memo, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { shadows, sizes } from "@/styles/global";
import { styles, weekCalendarMetrics } from "./styles";
import type { DayCardProps } from "./types";
import { dateKey } from "./useWeek";

const timingConfig = {
  duration: weekCalendarMetrics.animDuration,
  easing: Easing.out(Easing.cubic),
};

const springConfig = {
  damping: 18,
  stiffness: 220,
  mass: 0.8,
};

function DayCardComponent({ date, selected, hasActivity, isToday, onPress }: DayCardProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = selected
      ? withSpring(1, springConfig)
      : withTiming(0, timingConfig);
  }, [progress, selected]);

  const containerStyle = useAnimatedStyle(() => {
    const selectedProgress = progress.value;

    return {
      width: interpolate(
        selectedProgress,
        [0, 1],
        [weekCalendarMetrics.dayWidth, weekCalendarMetrics.selectedWidth],
      ),
      backgroundColor: interpolateColor(
        selectedProgress,
        [0, 1],
        [weekCalendarMetrics.colors.dayBg, weekCalendarMetrics.colors.selectedBg],
      ),
      borderWidth: weekCalendarMetrics.selectedBorderWidth,
      borderColor: interpolateColor(
        selectedProgress,
        [0, 1],
        [weekCalendarMetrics.colors.dayBg, weekCalendarMetrics.colors.selectedBorder],
      ),
      shadowColor: shadows.weekCalendarSelected.shadowColor,
      shadowOffset: shadows.weekCalendarSelected.shadowOffset,
      shadowOpacity: interpolate(
        selectedProgress,
        [0, 1],
        [0, shadows.weekCalendarSelected.shadowOpacity],
      ),
      shadowRadius: shadows.weekCalendarSelected.shadowRadius,
      elevation: selectedProgress > 0.5 ? sizes.weekCalendarSelectedElevation : 0,
    };
  });

  const weekdayLabel = selected ? format(date, "EEEE") : format(date, "EEEEE");
  const dayNumber = format(date, "d");

  return (
    <Pressable
      style={[styles.daySlot, selected && isToday ? styles.daySlotElevated : null]}
      onPress={() => {
        onPress(date);
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={format(date, "EEEE, MMMM d")}
    >
      <Animated.View style={[styles.dayCard, containerStyle]}>
        <View style={styles.dayLabelStack}>
          <Animated.Text
            style={styles.weekday}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {weekdayLabel}
          </Animated.Text>
          <Animated.Text style={styles.dayNumber}>
            {dayNumber}
          </Animated.Text>
        </View>
        {selected ? (
          isToday ? (
            <Animated.Text style={styles.todayLabel}>Today</Animated.Text>
          ) : (
            <Animated.View style={styles.activityDotPlaceholder} />
          )
        ) : hasActivity ? (
          <Animated.View style={styles.activityDot} />
        ) : (
          <Animated.View style={styles.activityDotPlaceholder} />
        )}
      </Animated.View>
    </Pressable>
  );
}

function dayCardPropsAreEqual(prev: DayCardProps, next: DayCardProps): boolean {
  return (
    dateKey(prev.date) === dateKey(next.date) &&
    prev.selected === next.selected &&
    prev.hasActivity === next.hasActivity &&
    prev.isToday === next.isToday &&
    prev.onPress === next.onPress
  );
}

export const DayCard = memo(DayCardComponent, dayCardPropsAreEqual);
