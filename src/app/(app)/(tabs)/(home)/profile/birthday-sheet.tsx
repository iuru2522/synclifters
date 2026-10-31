import { ProfileBirthdaySheet } from "@/components/app/profile-birthday-sheet";
import { useAuth } from "@/features/auth/auth-context";
import {
  formatBirthdayForStorage,
  formatProfileBirthday,
  parseBirthdayDate,
} from "@/features/users/profile-display";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";

export default function BirthdaySheetScreen() {
  const { profile } = useAuth();
  const { saveField } = useSaveProfileField();
  const initialBirthday = formatProfileBirthday(profile);
  const initialDate = parseBirthdayDate(
    initialBirthday === "Not set" ? null : initialBirthday,
  );

  return (
    <ProfileBirthdaySheet
      initialDate={initialDate}
      onSave={async (date) => {
        const birthday = formatBirthdayForStorage(date);
        await saveField(
          { birthday },
          "You must be signed in to update your birthday.",
        );
      }}
    />
  );
}
