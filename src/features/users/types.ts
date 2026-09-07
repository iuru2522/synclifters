import type { EpochMillis } from "@/lib/firestore-timestamps";
import type {
  UserFirstWeekDay,
  UserGender,
  UserSportsExperience,
  UserStats,
  UserWeightUnit,
} from "@/features/users/user-profile";

export type BodyMetricType = "weight" | "height";

export type BodyMetricSource = "profile" | "progress";

export type BodyMetricEntry = {
  id: string;
  type: BodyMetricType;
  value: number;
  unit: UserWeightUnit | "cm" | "in" | string;
  recordedAt: EpochMillis | null;
  source: BodyMetricSource;
};

export type {
  UserFirstWeekDay,
  UserGender,
  UserSportsExperience,
  UserStats,
  UserWeightUnit,
};
