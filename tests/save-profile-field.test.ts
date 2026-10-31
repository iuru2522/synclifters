import { describe, expect, it, vi } from "vitest";
import {
  commitProfileLocalPatch,
  saveProfileField,
} from "@/features/users/save-profile-field";

vi.mock("@/features/users/user-profile", () => ({
  updateUserProfile: vi.fn(async () => undefined),
}));

import { updateUserProfile } from "@/features/users/user-profile";

describe("saveProfileField", () => {
  it("writes Firestore, patches local profile, and silently refreshes", async () => {
    const patchProfile = vi.fn();
    const refreshProfile = vi.fn(async () => undefined);

    await saveProfileField({
      uid: "user-1",
      patch: { gender: "female" },
      patchProfile,
      refreshProfile,
    });

    expect(updateUserProfile).toHaveBeenCalledWith("user-1", { gender: "female" });
    expect(patchProfile).toHaveBeenCalledWith({ gender: "female" });
    expect(refreshProfile).toHaveBeenCalledWith({ silent: true });
  });

  it("throws a clear signed-out error before mutating", async () => {
    const patchProfile = vi.fn();
    const refreshProfile = vi.fn(async () => undefined);

    await expect(
      saveProfileField({
        uid: null,
        patch: { gender: "male" },
        patchProfile,
        refreshProfile,
        signedOutError: "You must be signed in to update your gender.",
      }),
    ).rejects.toThrow("You must be signed in to update your gender.");

    expect(updateUserProfile).not.toHaveBeenCalled();
    expect(patchProfile).not.toHaveBeenCalled();
    expect(refreshProfile).not.toHaveBeenCalled();
  });
});

describe("commitProfileLocalPatch", () => {
  it("patches local profile and silently refreshes", () => {
    const patchProfile = vi.fn();
    const refreshProfile = vi.fn(async () => undefined);

    commitProfileLocalPatch({
      patch: { weight: 80 },
      patchProfile,
      refreshProfile,
    });

    expect(patchProfile).toHaveBeenCalledWith({ weight: 80 });
    expect(refreshProfile).toHaveBeenCalledWith({ silent: true });
  });
});
