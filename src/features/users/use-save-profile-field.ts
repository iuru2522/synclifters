import { useCallback } from "react";
import { useAuth } from "@/features/auth/auth-context";
import {
  DEFAULT_SIGNED_OUT_ERROR,
  commitProfileLocalPatch,
  saveProfileField,
} from "@/features/users/save-profile-field";
import type {
  UpdateUserProfileInput,
  UserProfile,
} from "@/features/users/user-profile";

export function useSaveProfileField() {
  const { user, patchProfile, refreshProfile } = useAuth();

  const requireUid = useCallback(
    (signedOutError = DEFAULT_SIGNED_OUT_ERROR) => {
      if (!user) {
        throw new Error(signedOutError);
      }

      return user.uid;
    },
    [user],
  );

  const saveField = useCallback(
    async (
      patch: UpdateUserProfileInput,
      signedOutError = DEFAULT_SIGNED_OUT_ERROR,
    ) => {
      await saveProfileField({
        uid: user?.uid,
        patch,
        patchProfile,
        refreshProfile,
        signedOutError,
      });
    },
    [user?.uid, patchProfile, refreshProfile],
  );

  const commitLocalPatch = useCallback(
    (patch: Partial<UserProfile>) => {
      commitProfileLocalPatch({
        patch,
        patchProfile,
        refreshProfile,
      });
    },
    [patchProfile, refreshProfile],
  );

  return { user, requireUid, saveField, commitLocalPatch };
}
