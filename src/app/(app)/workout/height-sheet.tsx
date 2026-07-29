import {
  ProfileHeightSheet,
  resolveProfileHeight,
} from "@/components/app/profile-height-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { updateUserProfile } from "@/features/users/user-profile";

export default function HeightSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const { height, unit } = resolveProfileHeight(profile?.height, profile?.weightUnit);

  return (
    <ProfileHeightSheet
      initialHeight={height}
      unit={unit}
      onSave={async (nextHeight) => {
        if (!user) {
          throw new Error("You must be signed in to update your height.");
        }

        await updateUserProfile(user.uid, { height: nextHeight });
        patchProfile({ height: nextHeight });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
