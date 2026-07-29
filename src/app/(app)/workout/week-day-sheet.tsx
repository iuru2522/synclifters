import { ProfileWeekDaySheet } from "@/components/app/profile-week-day-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { updateUserProfile, type UserFirstWeekDay } from "@/features/users/user-profile";

export default function WeekDaySheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const initialValue: UserFirstWeekDay = profile?.firstWeekDay === "monday" ? "monday" : "sunday";

  return (
    <ProfileWeekDaySheet
      initialValue={initialValue}
      onSave={async (firstWeekDay) => {
        if (!user) {
          throw new Error("You must be signed in to update your first week day.");
        }

        await updateUserProfile(user.uid, { firstWeekDay });
        patchProfile({ firstWeekDay });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
