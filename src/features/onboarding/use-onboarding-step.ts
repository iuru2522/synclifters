import { router, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useGuardedAsyncAction } from "./use-guarded-async-action";

type UseOnboardingStepOptions = {
  save: () => Promise<void>;
  nextHref: Href;
  saveErrorMessage: string;
  continueErrorMessage?: string;
};

export function useOnboardingStep({
  save,
  nextHref,
  saveErrorMessage,
  continueErrorMessage = "Failed to continue.",
}: UseOnboardingStepOptions) {
  const runOnce = useGuardedAsyncAction();
  const [saving, setSaving] = useState(false);

  const runSaveAndNavigate = useCallback(
    (errorMessage: string) => {
      void runOnce(async () => {
        setSaving(true);

        try {
          await save();
          router.push(nextHref);
        } catch (error) {
          const message = error instanceof Error ? error.message : errorMessage;
          Alert.alert("Could not continue", message);
        } finally {
          setSaving(false);
        }
      });
    },
    [nextHref, runOnce, save],
  );

  const handleNext = useCallback(() => {
    runSaveAndNavigate(saveErrorMessage);
  }, [runSaveAndNavigate, saveErrorMessage]);

  const handleSkip = useCallback(() => {
    runSaveAndNavigate(continueErrorMessage);
  }, [continueErrorMessage, runSaveAndNavigate]);

  return { saving, handleNext, handleSkip };
}
