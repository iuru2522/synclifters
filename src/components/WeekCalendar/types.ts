export type WeekStartsOn = 0 | 1;

export type WeekCalendarProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  weekStartsOn?: WeekStartsOn;
  activityDates?: Date[];
};

export type WeekPage = {
  key: string;
  weekStart: Date;
  days: Date[];
};

export type DayCardProps = {
  date: Date;
  selected: boolean;
  hasActivity: boolean;
  isToday: boolean;
  onPress: (date: Date) => void;
};
