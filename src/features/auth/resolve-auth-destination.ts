import type { Href } from "expo-router";
import { isOnboardingPathname } from "@/features/onboarding/onboarding-routes";
import {
  isOnboardingComplete,
  type UserProfile,
} from "@/features/users/user-profile";

export type AuthGateInput = {
  isConfigured: boolean;
  hasUser: boolean;
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  isEmailVerified: boolean;
  profile: UserProfile | null;
  pathname: string;
};

export type AuthAccess = {
  sessionReady: boolean;
  canAccessApp: boolean;
  canAccessAuth: boolean;
};

const SIGN_UP_HREF = "/sign-up" as Href;
const VERIFY_EMAIL_HREF = "/verify-email" as Href;
const GENDER_HREF = "/gender" as Href;
const WORKOUT_HREF = "/workout" as Href;

const PUBLIC_AUTH_SEGMENTS = new Set([
  "sign-in",
  "sign-up",
  "forgot-password",
  "new-password",
  "success",
  "error",
  "contact-us",
  "support-submitted",
  "support-error",
]);

function pathSegment(pathname: string): string {
  return pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop() ?? "";
}

function startsWithPath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isVerifyEmailPath(pathname: string): boolean {
  return startsWithPath(pathname, "/verify-email") || pathname.includes("verify-email");
}

function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_SEGMENTS.has(pathSegment(pathname));
}

function isRootPath(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

/** Auth / onboarding routes that a fully ready user should leave for the app. */
function isAuthFunnelPath(pathname: string): boolean {
  return (
    isRootPath(pathname) ||
    isPublicAuthPath(pathname) ||
    isVerifyEmailPath(pathname) ||
    isOnboardingPathname(pathname) ||
    startsWithPath(pathname, "/gender")
  );
}

export function isAuthSessionReady(
  input: Pick<
    AuthGateInput,
    "isAuthLoading" | "hasUser" | "isProfileLoading" | "profile"
  >,
): boolean {
  if (input.isAuthLoading) {
    return false;
  }

  if (input.hasUser && input.isProfileLoading && !input.profile) {
    return false;
  }

  return true;
}

export function getAuthAccess(
  input: Pick<
    AuthGateInput,
    | "isConfigured"
    | "hasUser"
    | "isAuthLoading"
    | "isProfileLoading"
    | "isEmailVerified"
    | "profile"
  >,
): AuthAccess {
  const sessionReady = isAuthSessionReady(input);
  const canAccessApp =
    sessionReady &&
    input.isConfigured &&
    input.hasUser &&
    input.isEmailVerified &&
    isOnboardingComplete(input.profile);

  return {
    sessionReady,
    canAccessApp,
    canAccessAuth: !canAccessApp,
  };
}

/**
 * Canonical destination for the current auth state.
 * `null` = still loading, or already on an allowed screen (stay).
 */
export function resolveAuthDestination(input: AuthGateInput): Href | null {
  if (!isAuthSessionReady(input)) {
    return null;
  }

  if (!input.isConfigured || !input.hasUser) {
    if (isPublicAuthPath(input.pathname)) {
      return null;
    }

    return SIGN_UP_HREF;
  }

  if (!input.isEmailVerified) {
    if (isVerifyEmailPath(input.pathname)) {
      return null;
    }

    return VERIFY_EMAIL_HREF;
  }

  if (!isOnboardingComplete(input.profile)) {
    if (isOnboardingPathname(input.pathname) || startsWithPath(input.pathname, "/gender")) {
      return null;
    }

    return GENDER_HREF;
  }

  if (isAuthFunnelPath(input.pathname)) {
    return WORKOUT_HREF;
  }

  return null;
}
