import { PickerFieldSheet } from "@/components/app/picker-field-sheet";
import type { UserSportsExperience } from "@/features/users/user-profile";

const EXPERIENCE_OPTIONS: { label: string; value: UserSportsExperience }[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Gym Rat", value: "gym-rat" },
  { label: "Beast Mode", value: "beast-mode" },
];

export type ProfileSportsExperienceSheetProps = {
  initialValue: UserSportsExperience;
  onSave: (value: UserSportsExperience) => Promise<void>;
};

export function ProfileSportsExperienceSheet({
  initialValue,
  onSave,
}: ProfileSportsExperienceSheetProps) {
  return (
    <PickerFieldSheet
      initialValue={initialValue}
      options={EXPERIENCE_OPTIONS}
      accessibilityLabel="Sports experience"
      onSave={onSave}
    />
  );
}
