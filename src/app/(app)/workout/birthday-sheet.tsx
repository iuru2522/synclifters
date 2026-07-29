import { ProfileBirthdaySheet } from "@/components/app/profile-birthday-sheet";
import { useAuth } from "@/features/auth/auth-context";
import {
  formatBirthdayForStorage,
  formatProfileBirthday,
  parseBirthdayDate,
} from "@/features/users/profile-display";
import { updateUserProfile } from "@/features/users/user-profile";

export default function BirthdaySheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const initialBirthday = formatProfileBirthday(profile);
  const initialDate = parseBirthdayDate(
    initialBirthday === "Not set" ? null : initialBirthday,
  );

  return (
    <ProfileBirthdaySheet
      initialDate={initialDate}
      onSave={async (date) => {
        if (!user) {
          throw new Error("You must be signed in to update your birthday.");
        }

        const birthday = formatBirthdayForStorage(date);
        await updateUserProfile(user.uid, { birthday });
        patchProfile({ birthday });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
