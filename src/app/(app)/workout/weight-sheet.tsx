import {
  ProfileWeightSheet,
  resolveProfileWeight,
} from "@/components/app/profile-weight-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { updateUserProfile } from "@/features/users/user-profile";

export default function WeightSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const { weight, unit } = resolveProfileWeight(profile?.weight, profile?.weightUnit);

  return (
    <ProfileWeightSheet
      initialWeight={weight}
      unit={unit}
      onSave={async (nextWeight) => {
        if (!user) {
          throw new Error("You must be signed in to update your weight.");
        }

        await updateUserProfile(user.uid, { weight: nextWeight });
        patchProfile({ weight: nextWeight });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
