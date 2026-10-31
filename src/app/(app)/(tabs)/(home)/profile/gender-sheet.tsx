import { ProfileGenderSheet } from "@/components/app/profile-gender-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";
import type { UserGender } from "@/features/users/user-profile";

export default function GenderSheetScreen() {
  const { profile } = useAuth();
  const { saveField } = useSaveProfileField();
  const initialValue: UserGender = profile?.gender === "female" ? "female" : "male";

  return (
    <ProfileGenderSheet
      initialValue={initialValue}
      onSave={(gender) =>
        saveField({ gender }, "You must be signed in to update your gender.")
      }
    />
  );
}
