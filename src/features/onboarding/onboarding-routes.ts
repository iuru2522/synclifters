export const ONBOARDING_ROUTES = [
  "gender",
  "weight",
  "age",
  "height",
  "sports-experience",
] as const;

export type OnboardingRoute = (typeof ONBOARDING_ROUTES)[number];

const ONBOARDING_ROUTE_SET = new Set<string>(ONBOARDING_ROUTES);

export function isOnboardingSegment(segment: string) {
  return ONBOARDING_ROUTE_SET.has(segment);
}

export function isOnboardingPathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  const segment = normalized.split("/").pop() ?? "";

  return isOnboardingSegment(segment);
}
