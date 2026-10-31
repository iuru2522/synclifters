import { convertHeight } from "@/components/auth/height-ruler-units";
import { convertWeight } from "@/components/auth/weight-ruler-units";
import { ProfileMetricsSheet } from "@/components/app/profile-metrics-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { updateUserProfile, type UserWeightUnit } from "@/features/users/user-profile";

export default function MetricsSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const initialValue: UserWeightUnit = profile?.weightUnit === "lb" ? "lb" : "kg";

  return (
    <ProfileMetricsSheet
      initialValue={initialValue}
      onSave={async (weightUnit) => {
        if (!user) {
          throw new Error("You must be signed in to update your metrics.");
        }

        const currentUnit: UserWeightUnit = profile?.weightUnit === "lb" ? "lb" : "kg";
        const nextWeight =
          typeof profile?.weight === "number"
            ? convertWeight(profile.weight, currentUnit, weightUnit)
            : undefined;
        const nextHeight =
          typeof profile?.height === "number"
            ? convertHeight(profile.height, currentUnit, weightUnit)
            : undefined;

        await updateUserProfile(user.uid, {
          weightUnit,
          ...(nextWeight !== undefined ? { weight: nextWeight } : {}),
          ...(nextHeight !== undefined ? { height: nextHeight } : {}),
        });
        patchProfile({
          weightUnit,
          ...(nextWeight !== undefined ? { weight: nextWeight } : {}),
          ...(nextHeight !== undefined ? { height: nextHeight } : {}),
        });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
