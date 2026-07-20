import type { Gender } from "@/components/auth/gender-form";
import type { SportsExperience } from "@/components/auth/sports-experience-form";
import type { WeightUnit } from "@/components/auth/weight-unit-toggle";
import { useAuth } from "@/features/auth/auth-context";
import {
  createUserProfile,
  updateUserProfile,
  type UserGender,
  type UserSportsExperience,
} from "@/features/users/user-profile";
import { sizes } from "@/styles/global";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useMeasurementUnit } from "./measurement-unit-context";

type OnboardingContextValue = {
  weight: number;
  setWeight: Dispatch<SetStateAction<number>>;
  age: number;
  setAge: Dispatch<SetStateAction<number>>;
  height: number;
  setHeight: Dispatch<SetStateAction<number>>;
  saveGender: (gender: Gender | null) => Promise<void>;
  saveWeight: () => Promise<void>;
  saveAge: () => Promise<void>;
  saveHeight: () => Promise<void>;
  finishOnboarding: (experience: SportsExperience) => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, profile, refreshProfile, patchProfile } = useAuth();
  const { unit, setUnit } = useMeasurementUnit();
  const [weight, setWeight] = useState<number>(sizes.weightRulerDefault);
  const [age, setAge] = useState<number>(sizes.ageWheelDefault);
  const [height, setHeight] = useState<number>(sizes.heightRulerDefault);
  const hydratedProfileUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      hydratedProfileUidRef.current = null;
      return;
    }

    if (!profile || hydratedProfileUidRef.current === user.uid) {
      return;
    }

    hydratedProfileUidRef.current = user.uid;

    if (typeof profile.weight === "number") {
      setWeight(profile.weight);
    }

    if (typeof profile.age === "number") {
      setAge(profile.age);
    }

    if (typeof profile.height === "number") {
      setHeight(profile.height);
    }

    if (profile.weightUnit === "kg" || profile.weightUnit === "lb") {
      setUnit(profile.weightUnit);
    }
  }, [profile, setUnit, user]);

  const ensureProfile = useCallback(async () => {
    if (!user) {
      throw new Error("You must be signed in to continue onboarding.");
    }

    if (profile) {
      return;
    }

    const displayName = user.displayName?.trim() ?? "";
    const [firstName = "", ...lastNameParts] = displayName.split(/\s+/);
    const lastName = lastNameParts.join(" ");

    await createUserProfile(user.uid, {
      firstName,
      lastName,
      email: user.email ?? "",
    });
    await refreshProfile({ silent: true });
  }, [profile, refreshProfile, user]);

  const saveGender = useCallback(
    async (gender: Gender | null) => {
      await ensureProfile();

      if (!user) {
        throw new Error("You must be signed in to continue onboarding.");
      }

      await updateUserProfile(user.uid, {
        gender: gender as UserGender | null,
      });
      patchProfile({ gender: gender as UserGender | null });
      void refreshProfile({ silent: true });
    },
    [ensureProfile, patchProfile, refreshProfile, user],
  );

  const saveWeight = useCallback(async () => {
    await ensureProfile();

    if (!user) {
      throw new Error("You must be signed in to continue onboarding.");
    }

    const weightUnit = unit as WeightUnit;

    await updateUserProfile(user.uid, {
      weight,
      weightUnit,
    });
    patchProfile({ weight, weightUnit });
    void refreshProfile({ silent: true });
  }, [ensureProfile, patchProfile, refreshProfile, unit, user, weight]);

  const saveAge = useCallback(async () => {
    await ensureProfile();

    if (!user) {
      throw new Error("You must be signed in to continue onboarding.");
    }

    await updateUserProfile(user.uid, { age });
    patchProfile({ age });
    void refreshProfile({ silent: true });
  }, [age, ensureProfile, patchProfile, refreshProfile, user]);

  const saveHeight = useCallback(async () => {
    await ensureProfile();

    if (!user) {
      throw new Error("You must be signed in to continue onboarding.");
    }

    await updateUserProfile(user.uid, { height });
    patchProfile({ height });
    void refreshProfile({ silent: true });
  }, [ensureProfile, height, patchProfile, refreshProfile, user]);

  const finishOnboarding = useCallback(
    async (experience: SportsExperience) => {
      await ensureProfile();

      if (!user) {
        throw new Error("You must be signed in to continue onboarding.");
      }

      const sportsExperience = experience as UserSportsExperience;

      await updateUserProfile(user.uid, {
        sportsExperience,
        onboardingComplete: true,
      });
      patchProfile({ sportsExperience, onboardingComplete: true });
      void refreshProfile({ silent: true });
    },
    [ensureProfile, patchProfile, refreshProfile, user],
  );

  const value = useMemo(
    () => ({
      weight,
      setWeight,
      age,
      setAge,
      height,
      setHeight,
      saveGender,
      saveWeight,
      saveAge,
      saveHeight,
      finishOnboarding,
    }),
    [
      age,
      finishOnboarding,
      height,
      saveAge,
      saveGender,
      saveHeight,
      saveWeight,
      weight,
    ],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider.");
  }

  return context;
}
