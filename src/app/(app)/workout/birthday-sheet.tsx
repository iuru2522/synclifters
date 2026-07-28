import { ProfileFieldSheet } from "@/components/app/profile-field-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileBirthday } from "@/features/users/profile-display";
import { updateUserProfile } from "@/features/users/user-profile";

export default function BirthdaySheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const initialBirthday = formatProfileBirthday(profile);
  const initialValue = initialBirthday === "Not set" ? "" : initialBirthday;

  return (
    <ProfileFieldSheet
      label="Birthday"
      placeholder="birthday"
      initialValue={initialValue}
      autoCapitalize="none"
      autoComplete="birthdate-full"
      textContentType="birthdate"
      emptyErrorTitle="Birthday required"
      emptyErrorMessage="Please enter your birthday."
      onSave={async (birthday) => {
        if (!user) {
          throw new Error("You must be signed in to update your birthday.");
        }

        await updateUserProfile(user.uid, { birthday });
        patchProfile({ birthday });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
