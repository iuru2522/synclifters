import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import type { UserGender } from "@/features/users/user-profile";

const GENDER_OPTIONS: { label: string; value: UserGender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export type ProfileGenderSheetProps = {
  initialValue: UserGender;
  onSave: (value: UserGender) => Promise<void>;
};

export function ProfileGenderSheet({ initialValue, onSave }: ProfileGenderSheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={GENDER_OPTIONS}
      accessibilityLabel="Gender"
      onSave={onSave}
    />
  );
}
