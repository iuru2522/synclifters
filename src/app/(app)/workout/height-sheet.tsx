import {
  ProfileHeightSheet,
  resolveProfileHeight,
} from "@/components/app/profile-height-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { saveHeightWithHistory } from "@/features/users/body-metrics-repository";
import type { BodyMetricSource } from "@/features/users/types";
import { useLocalSearchParams } from "expo-router";

export default function HeightSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
  const params = useLocalSearchParams<{ source?: string | string[] }>();
  const rawSource = Array.isArray(params.source) ? params.source[0] : params.source;
  const source: BodyMetricSource =
    rawSource === "progress" ? "progress" : "profile";
  const { height, unit } = resolveProfileHeight(profile?.height, profile?.weightUnit);

  return (
    <ProfileHeightSheet
      initialHeight={height}
      unit={unit}
      onSave={async (nextHeight) => {
        if (!user) {
          throw new Error("You must be signed in to update your height.");
        }

        await saveHeightWithHistory(
          user.uid,
          nextHeight,
          profile?.weightUnit,
          source,
        );
        patchProfile({ height: nextHeight });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
