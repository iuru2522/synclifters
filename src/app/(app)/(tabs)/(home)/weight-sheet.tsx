import {
  ProfileWeightSheet,
  resolveProfileWeight,
} from "@/components/app/profile-weight-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { saveWeightWithHistory } from "@/features/users/body-metrics-repository";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";
import type { BodyMetricSource } from "@/features/users/types";
import { useLocalSearchParams } from "expo-router";

function resolveBodyMetricSource(raw: string | undefined): BodyMetricSource {
  return raw === "progress" || raw === "workout" ? "progress" : "profile";
}

export default function WeightSheetScreen() {
  const { profile } = useAuth();
  const { requireUid, commitLocalPatch } = useSaveProfileField();
  const params = useLocalSearchParams<{ source?: string | string[] }>();
  const rawSource = Array.isArray(params.source) ? params.source[0] : params.source;
  const source = resolveBodyMetricSource(rawSource);
  const { weight, unit } = resolveProfileWeight(profile?.weight, profile?.weightUnit);

  return (
    <ProfileWeightSheet
      initialWeight={weight}
      unit={unit}
      onSave={async (nextWeight) => {
        const uid = requireUid("You must be signed in to update your weight.");
        await saveWeightWithHistory(uid, nextWeight, unit, source);
        commitLocalPatch({ weight: nextWeight });
      }}
    />
  );
}
