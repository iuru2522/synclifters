import {
  ProfileWeightSheet,
  resolveProfileWeight,
} from "@/components/app/profile-weight-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { saveWeightWithHistory } from "@/features/users/body-metrics-repository";
import type { BodyMetricSource } from "@/features/users/types";
import { useLocalSearchParams } from "expo-router";

export default function WeightSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const params = useLocalSearchParams<{ source?: string | string[] }>();
  const rawSource = Array.isArray(params.source) ? params.source[0] : params.source;
  const source: BodyMetricSource =
    rawSource === "progress" ? "progress" : "profile";
  const { weight, unit } = resolveProfileWeight(profile?.weight, profile?.weightUnit);

  return (
    <ProfileWeightSheet
      initialWeight={weight}
      unit={unit}
      onSave={async (nextWeight) => {
        if (!user) {
          throw new Error("You must be signed in to update your weight.");
        }

        await saveWeightWithHistory(user.uid, nextWeight, unit, source);
        patchProfile({ weight: nextWeight });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
