import type {
  UserGender,
  UserProfile,
  UserSportsExperience,
  UserWeightUnit,
} from "./user-profile";

export type ProfileField = {
  label: string;
  value: string;
};

const SPORTS_EXPERIENCE_LABELS: Record<UserSportsExperience, string> = {
  beginner: "Beginner",
  "gym-rat": "Gym Rat",
  "beast-mode": "Beast Mode",
};

function formatGender(gender: UserGender | null | undefined) {
  if (gender === "male") {
    return "Male";
  }

  if (gender === "female") {
    return "Female";
  }

  return "Not set";
}

function formatWeight(weight: number | null | undefined, unit: UserWeightUnit | null | undefined) {
  if (typeof weight !== "number") {
    return "Not set";
  }

  const weightUnit = unit === "lb" ? "lb" : "kg";

  return `${weight} ${weightUnit}`;
}

function formatAge(age: number | null | undefined) {
  if (typeof age !== "number") {
    return "Not set";
  }

  return `${age} years`;
}

function formatHeight(
  height: number | null | undefined,
  unit: UserWeightUnit | null | undefined,
) {
  if (typeof height !== "number") {
    return "Not set";
  }

  const heightUnit = unit === "lb" ? "in" : "cm";

  return `${height} ${heightUnit}`;
}

function formatSportsExperience(experience: UserSportsExperience | null | undefined) {
  if (!experience) {
    return "Not set";
  }

  return SPORTS_EXPERIENCE_LABELS[experience];
}

export function formatProfileFields(profile: UserProfile | null): ProfileField[] {
  if (!profile) {
    return [];
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return [
    { label: "Full name", value: fullName || "Not set" },
    { label: "Email", value: profile.email || "Not set" },
    { label: "Gender", value: formatGender(profile.gender) },
    { label: "Weight", value: formatWeight(profile.weight, profile.weightUnit) },
    { label: "Age", value: formatAge(profile.age) },
    { label: "Height", value: formatHeight(profile.height, profile.weightUnit) },
    {
      label: "Sports experience",
      value: formatSportsExperience(profile.sportsExperience),
    },
  ];
}
