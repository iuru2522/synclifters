import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WeightUnit } from "@/components/auth/weight-unit-toggle";

type MeasurementUnitContextValue = {
  unit: WeightUnit;
  setUnit: (unit: WeightUnit) => void;
};

const MeasurementUnitContext = createContext<MeasurementUnitContextValue | null>(null);

export function MeasurementUnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<WeightUnit>("kg");

  const value = useMemo(
    () => ({
      unit,
      setUnit,
    }),
    [unit],
  );

  return (
    <MeasurementUnitContext.Provider value={value}>{children}</MeasurementUnitContext.Provider>
  );
}

export function useMeasurementUnit() {
  const context = useContext(MeasurementUnitContext);

  if (!context) {
    throw new Error("useMeasurementUnit must be used within MeasurementUnitProvider");
  }

  return context;
}
