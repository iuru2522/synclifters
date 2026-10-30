import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import type { UserFirstWeekDay } from "@/features/users/user-profile";

const WEEK_DAY_OPTIONS: { label: string; value: UserFirstWeekDay }[] = [
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
];

export type ProfileWeekDaySheetProps = {
  initialValue: UserFirstWeekDay;
  onSave: (value: UserFirstWeekDay) => Promise<void>;
};

export function ProfileWeekDaySheet({ initialValue, onSave }: ProfileWeekDaySheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={WEEK_DAY_OPTIONS}
      accessibilityLabel="1st Week Day"
      onSave={onSave}
    />
  );
}
