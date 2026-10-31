import { ProfileWeekDaySheet } from "@/components/app/profile-week-day-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";
import type { UserFirstWeekDay } from "@/features/users/user-profile";

export default function WeekDaySheetScreen() {
  const { profile } = useAuth();
  const { saveField } = useSaveProfileField();
  const initialValue: UserFirstWeekDay =
    profile?.firstWeekDay === "monday" ? "monday" : "sunday";

  return (
    <ProfileWeekDaySheet
      initialValue={initialValue}
      onSave={(firstWeekDay) =>
        saveField(
          { firstWeekDay },
          "You must be signed in to update your first week day.",
        )
      }
    />
  );
}
