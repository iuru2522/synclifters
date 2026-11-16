import { StyleSheet } from "react-native";
import { colors, fonts, shadows, sizes, spacing, typography } from "@/styles/global";

export const weekCalendarMetrics = {
  dayWidth: sizes.weekCalendarDayWidth,
  selectedWidth: sizes.weekCalendarSelectedWidth,
  dayHeight: sizes.weekCalendarDayHeight,
  radius: sizes.weekCalendarDayRadius,
  activityDot: sizes.weekCalendarActivityDot,
  selectedBorderWidth: sizes.weekCalendarSelectedBorderWidth,
  animDuration: sizes.weekCalendarAnimDuration,
  todayElevate: spacing.weekCalendarTodayElevate,
  inset: spacing.workoutGlassCardsInset,
  colors: {
    dayBg: colors.weekCalendarDay,
    dayText: colors.weekCalendarDayText,
    selectedBg: colors.white,
    selectedText: colors.black,
    selectedBorder: colors.weekCalendarDay,
    activityDot: colors.weekCalendarDayText,
  },
} as const;

export const styles = StyleSheet.create({
  list: {
    height:
      sizes.weekCalendarDayHeight +
      shadows.weekCalendarSelected.shadowRadius +
      spacing.weekCalendarTodayElevate,
  },
  weekPage: {
    flexDirection: "row",
    alignItems: "flex-end",
    height:
      sizes.weekCalendarDayHeight +
      shadows.weekCalendarSelected.shadowRadius +
      spacing.weekCalendarTodayElevate,
    paddingHorizontal: spacing.workoutGlassCardsInset,
    gap: spacing.weekCalendarDayGap,
  },
  daySlot: {
    height: sizes.weekCalendarDayHeight + spacing.weekCalendarTodayElevate,
    justifyContent: "flex-end",
  },
  daySlotElevated: {
    paddingBottom: spacing.weekCalendarTodayElevate,
  },
  dayCard: {
    height: sizes.weekCalendarDayHeight,
    borderRadius: sizes.weekCalendarDayRadius,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: sizes.weekCalendarDayPaddingVertical,
    overflow: "visible",
  },
  dayLabelStack: {
    alignItems: "center",
    gap: spacing.weekCalendarWeekdayToDate,
  },
  weekday: {
    ...typography.weekCalendarWeekday,
    fontFamily: fonts.poppinsMedium,
    fontWeight: "500",
    color: colors.inputText,
    includeFontPadding: false,
    textAlign: "center",
  },
  dayNumber: {
    ...typography.weekCalendarDayNumber,
    fontFamily: fonts.poppinsMedium,
    fontWeight: "500",
    color: colors.inputText,
    includeFontPadding: false,
    textAlign: "center",
  },
  selectedDayNumber: {
    ...typography.weekCalendarSelectedDayNumber,
    fontFamily: fonts.poppinsMedium,
    fontWeight: "500",
    color: colors.inputText,
    includeFontPadding: false,
    textAlign: "center",
  },
  todayLabel: {
    ...typography.weekCalendarTodayLabel,
    fontFamily: fonts.poppinsMedium,
    fontWeight: "500",
    color: colors.inputText,
    includeFontPadding: false,
    textAlign: "center",
  },
  activityDot: {
    width: sizes.weekCalendarActivityDot,
    height: sizes.weekCalendarActivityDot,
    borderRadius: sizes.weekCalendarActivityDot / 2,
    backgroundColor: colors.weekCalendarDayText,
  },
  activityDotPlaceholder: {
    width: sizes.weekCalendarActivityDot,
    height: sizes.weekCalendarActivityDot,
  },
});
