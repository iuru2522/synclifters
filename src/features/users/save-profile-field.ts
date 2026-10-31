import {
  updateUserProfile,
  type UpdateUserProfileInput,
  type UserProfile,
} from "@/features/users/user-profile";

const DEFAULT_SIGNED_OUT_ERROR =
  "You must be signed in to update your profile.";

type SaveProfileFieldDeps = {
  patchProfile: (patch: Partial<UserProfile>) => void;
  refreshProfile: (options?: { silent?: boolean }) => Promise<void>;
};

export async function saveProfileField(input: {
  uid: string | null | undefined;
  patch: UpdateUserProfileInput;
  patchProfile: SaveProfileFieldDeps["patchProfile"];
  refreshProfile: SaveProfileFieldDeps["refreshProfile"];
  signedOutError?: string;
}): Promise<void> {
  if (!input.uid) {
    throw new Error(input.signedOutError ?? DEFAULT_SIGNED_OUT_ERROR);
  }

  await updateUserProfile(input.uid, input.patch);
  input.patchProfile(input.patch);
  void input.refreshProfile({ silent: true });
}

export function commitProfileLocalPatch(
  input: SaveProfileFieldDeps & {
    patch: Partial<UserProfile>;
  },
): void {
  input.patchProfile(input.patch);
  void input.refreshProfile({ silent: true });
}

export { DEFAULT_SIGNED_OUT_ERROR };
