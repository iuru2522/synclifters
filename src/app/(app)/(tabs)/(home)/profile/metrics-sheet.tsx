import { convertHeight } from "@/components/auth/height-ruler-units";
import { convertWeight } from "@/components/auth/weight-ruler-units";
import { ProfileMetricsSheet } from "@/components/app/profile-metrics-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";
import type { UserWeightUnit } from "@/features/users/user-profile";

export default function MetricsSheetScreen() {
  const { profile } = useAuth();
  const { saveField } = useSaveProfileField();
  const initialValue: UserWeightUnit = profile?.weightUnit === "lb" ? "lb" : "kg";

  return (
    <ProfileMetricsSheet
      initialValue={initialValue}
      onSave={async (weightUnit) => {
        const currentUnit: UserWeightUnit =
          profile?.weightUnit === "lb" ? "lb" : "kg";
        const nextWeight =
          typeof profile?.weight === "number"
            ? convertWeight(profile.weight, currentUnit, weightUnit)
            : undefined;
        const nextHeight =
          typeof profile?.height === "number"
            ? convertHeight(profile.height, currentUnit, weightUnit)
            : undefined;

        await saveField(
          {
            weightUnit,
            ...(nextWeight !== undefined ? { weight: nextWeight } : {}),
            ...(nextHeight !== undefined ? { height: nextHeight } : {}),
          },
          "You must be signed in to update your metrics.",
        );
      }}
    />
  );
}
