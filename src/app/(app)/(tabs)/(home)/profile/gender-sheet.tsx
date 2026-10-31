import { ProfileGenderSheet } from "@/components/app/profile-gender-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { updateUserProfile, type UserGender } from "@/features/users/user-profile";

export default function GenderSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const initialValue: UserGender = profile?.gender === "female" ? "female" : "male";

  return (
    <ProfileGenderSheet
      initialValue={initialValue}
      onSave={async (gender) => {
        if (!user) {
          throw new Error("You must be signed in to update your gender.");
        }

        await updateUserProfile(user.uid, { gender });
        patchProfile({ gender });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
