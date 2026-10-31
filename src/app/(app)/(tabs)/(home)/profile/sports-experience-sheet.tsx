import { ProfileSportsExperienceSheet } from "@/components/app/profile-sports-experience-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";
import type { UserSportsExperience } from "@/features/users/user-profile";

function resolveInitialExperience(
  value: UserSportsExperience | null | undefined,
): UserSportsExperience {
  if (value === "gym-rat" || value === "beast-mode" || value === "beginner") {
    return value;
  }

  return "beginner";
}

export default function SportsExperienceSheetScreen() {
  const { profile } = useAuth();
  const { saveField } = useSaveProfileField();
  const initialValue = resolveInitialExperience(profile?.sportsExperience);

  return (
    <ProfileSportsExperienceSheet
      initialValue={initialValue}
      onSave={(sportsExperience) =>
        saveField(
          { sportsExperience },
          "You must be signed in to update your sports experience.",
        )
      }
    />
  );
}
