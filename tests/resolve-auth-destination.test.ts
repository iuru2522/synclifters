import { describe, expect, it } from "vitest";
import {
  getAuthAccess,
  resolveAuthDestination,
  type AuthGateInput,
} from "@/features/auth/resolve-auth-destination";
import type { UserProfile } from "@/features/users/user-profile";

function input(overrides: Partial<AuthGateInput> = {}): AuthGateInput {
  return {
    isConfigured: true,
    hasUser: false,
    isAuthLoading: false,
    isProfileLoading: false,
    isEmailVerified: false,
    profile: null,
    pathname: "/sign-up",
    ...overrides,
  };
}

function completeProfile(): UserProfile {
  return {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    createdAt: null,
    onboardingComplete: true,
  };
}

describe("getAuthAccess", () => {
  it("is not ready while auth is loading", () => {
    expect(getAuthAccess(input({ isAuthLoading: true }))).toEqual({
      sessionReady: false,
      canAccessApp: false,
      canAccessAuth: true,
    });
  });

  it("waits for profile when signed in without one yet", () => {
    expect(
      getAuthAccess(
        input({
          hasUser: true,
          isProfileLoading: true,
          profile: null,
          isEmailVerified: true,
        }),
      ),
    ).toEqual({
      sessionReady: false,
      canAccessApp: false,
      canAccessAuth: true,
    });
  });

  it("allows the auth stack for signed-out users", () => {
    expect(getAuthAccess(input())).toEqual({
      sessionReady: true,
      canAccessApp: false,
      canAccessAuth: true,
    });
  });

  it("keeps auth available while the session is still loading", () => {
    expect(getAuthAccess(input({ isAuthLoading: true })).canAccessAuth).toBe(
      true,
    );
  });

  it("allows app tabs only when verified and onboarded", () => {
    expect(
      getAuthAccess(
        input({
          hasUser: true,
          isEmailVerified: true,
          profile: completeProfile(),
        }),
      ),
    ).toEqual({
      sessionReady: true,
      canAccessApp: true,
      canAccessAuth: false,
    });
  });
});

describe("resolveAuthDestination", () => {
  it("returns null while loading", () => {
    expect(resolveAuthDestination(input({ isAuthLoading: true }))).toBeNull();
    expect(
      resolveAuthDestination(
        input({
          hasUser: true,
          isProfileLoading: true,
          profile: null,
        }),
      ),
    ).toBeNull();
  });

  it("keeps signed-out users on public auth screens", () => {
    expect(resolveAuthDestination(input({ pathname: "/sign-in" }))).toBeNull();
    expect(
      resolveAuthDestination(input({ pathname: "/forgot-password" })),
    ).toBeNull();
  });

  it("sends signed-out users away from gated screens to sign-up", () => {
    expect(
      resolveAuthDestination(input({ pathname: "/verify-email" })),
    ).toBe("/sign-up");
    expect(resolveAuthDestination(input({ pathname: "/gender" }))).toBe(
      "/sign-up",
    );
    expect(resolveAuthDestination(input({ pathname: "/workout" }))).toBe(
      "/sign-up",
    );
  });

  it("routes unverified users to verify-email", () => {
    expect(
      resolveAuthDestination(
        input({
          hasUser: true,
          isEmailVerified: false,
          pathname: "/sign-up",
          profile: { ...completeProfile(), onboardingComplete: false },
        }),
      ),
    ).toBe("/verify-email");
    expect(
      resolveAuthDestination(
        input({
          hasUser: true,
          isEmailVerified: false,
          pathname: "/verify-email",
        }),
      ),
    ).toBeNull();
  });

  it("routes incomplete onboarding to gender and allows onboarding steps", () => {
    const base = {
      hasUser: true,
      isEmailVerified: true,
      profile: { ...completeProfile(), onboardingComplete: false },
    } as const;

    expect(
      resolveAuthDestination(input({ ...base, pathname: "/verify-email" })),
    ).toBe("/gender");
    expect(
      resolveAuthDestination(input({ ...base, pathname: "/gender" })),
    ).toBeNull();
    expect(
      resolveAuthDestination(input({ ...base, pathname: "/weight" })),
    ).toBeNull();
  });

  it("sends completed users off verify/onboarding onto workout", () => {
    const base = {
      hasUser: true,
      isEmailVerified: true,
      profile: completeProfile(),
    } as const;

    expect(
      resolveAuthDestination(input({ ...base, pathname: "/verify-email" })),
    ).toBe("/workout");
    expect(
      resolveAuthDestination(input({ ...base, pathname: "/gender" })),
    ).toBe("/workout");
    expect(
      resolveAuthDestination(input({ ...base, pathname: "/workout" })),
    ).toBeNull();
  });

  it("sends completed users off sign-in/sign-up onto workout after login", () => {
    const base = {
      hasUser: true,
      isEmailVerified: true,
      profile: completeProfile(),
    } as const;

    expect(
      resolveAuthDestination(input({ ...base, pathname: "/sign-in" })),
    ).toBe("/workout");
    expect(
      resolveAuthDestination(input({ ...base, pathname: "/sign-up" })),
    ).toBe("/workout");
  });

  it("sends completed users off tabs root `/` onto workout (not history)", () => {
    expect(
      resolveAuthDestination(
        input({
          hasUser: true,
          isEmailVerified: true,
          profile: completeProfile(),
          pathname: "/",
        }),
      ),
    ).toBe("/workout");
  });
});
