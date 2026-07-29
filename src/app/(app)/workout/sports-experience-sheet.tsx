import { ProfileSportsExperienceSheet } from "@/components/app/profile-sports-experience-sheet";
import { useAuth } from "@/features/auth/auth-context";
import {
  updateUserProfile,
  type UserSportsExperience,
} from "@/features/users/user-profile";

function resolveInitialExperience(
  value: UserSportsExperience | null | undefined,
): UserSportsExperience {
  if (value === "gym-rat" || value === "beast-mode" || value === "beginner") {
    return value;
  }

  return "beginner";
}

export default function SportsExperienceSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const initialValue = resolveInitialExperience(profile?.sportsExperience);

  return (
    <ProfileSportsExperienceSheet
      initialValue={initialValue}
      onSave={async (sportsExperience) => {
        if (!user) {
          throw new Error("You must be signed in to update your sports experience.");
        }

        await updateUserProfile(user.uid, { sportsExperience });
        patchProfile({ sportsExperience });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
