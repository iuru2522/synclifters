import { useAuth } from "@/features/auth/auth-context";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
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
import type { Gender, SportsExperience } from "./types";

type OnboardingContextValue = {
  gender: Gender | null;
  setGender: Dispatch<SetStateAction<Gender | null>>;
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
  const [gender, setGender] = useState<Gender | null>(null);
  const [weight, setWeight] = useState<number>(sizes.weightRulerDefault);
  const [age, setAge] = useState<number>(sizes.ageWheelDefault);
  const [height, setHeight] = useState<number>(sizes.heightRulerDefault);
  const hydratedProfileUidRef = useRef<string | null>(null);
  const ensuredProfileUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      hydratedProfileUidRef.current = null;
      ensuredProfileUidRef.current = null;
      setGender(null);
      return;
    }

    if (!profile || hydratedProfileUidRef.current === user.uid) {
      return;
    }

    hydratedProfileUidRef.current = user.uid;

    if (profile.gender === "male" || profile.gender === "female") {
      setGender(profile.gender);
    } else if (profile.gender === null) {
      setGender(null);
    }

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

    if (profile || ensuredProfileUidRef.current === user.uid) {
      ensuredProfileUidRef.current = user.uid;
      return;
    }

    const existingProfile = await getUserProfile(user.uid);

    if (existingProfile) {
      ensuredProfileUidRef.current = user.uid;
      await refreshProfile({ silent: true });
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
    ensuredProfileUidRef.current = user.uid;
    await refreshProfile({ silent: true });
  }, [profile, refreshProfile, user]);

  const saveGender = useCallback(
    async (nextGender: Gender | null) => {
      await ensureProfile();

      if (!user) {
        throw new Error("You must be signed in to continue onboarding.");
      }

      await updateUserProfile(user.uid, {
        gender: nextGender,
      });
      setGender(nextGender);
      patchProfile({ gender: nextGender });
      void refreshProfile({ silent: true });
    },
    [ensureProfile, patchProfile, refreshProfile, user],
  );

  const saveWeight = useCallback(async () => {
    await ensureProfile();

    if (!user) {
      throw new Error("You must be signed in to continue onboarding.");
    }

    await updateUserProfile(user.uid, {
      weight,
      weightUnit: unit,
    });
    patchProfile({ weight, weightUnit: unit });
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

      await updateUserProfile(user.uid, {
        sportsExperience: experience,
        onboardingComplete: true,
      });
      patchProfile({ sportsExperience: experience, onboardingComplete: true });
      void refreshProfile({ silent: true });
    },
    [ensureProfile, patchProfile, refreshProfile, user],
  );

  const value = useMemo(
    () => ({
      gender,
      setGender,
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
      gender,
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
