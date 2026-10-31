import {
  ProfileHeightSheet,
  resolveProfileHeight,
} from "@/components/app/profile-height-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { saveHeightWithHistory } from "@/features/users/body-metrics-repository";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";
import type { BodyMetricSource } from "@/features/users/types";
import { useLocalSearchParams } from "expo-router";

function resolveBodyMetricSource(raw: string | undefined): BodyMetricSource {
  return raw === "progress" || raw === "workout" ? "progress" : "profile";
}

export default function HeightSheetScreen() {
  const { profile } = useAuth();
  const { requireUid, commitLocalPatch } = useSaveProfileField();
  const params = useLocalSearchParams<{ source?: string | string[] }>();
  const rawSource = Array.isArray(params.source) ? params.source[0] : params.source;
  const source = resolveBodyMetricSource(rawSource);
  const { height, unit } = resolveProfileHeight(profile?.height, profile?.weightUnit);

  return (
    <ProfileHeightSheet
      initialHeight={height}
      unit={unit}
      onSave={async (nextHeight) => {
        const uid = requireUid("You must be signed in to update your height.");
        await saveHeightWithHistory(uid, nextHeight, profile?.weightUnit, source);
        commitLocalPatch({ height: nextHeight });
      }}
    />
  );
}
