import { sizes } from "@/styles/global";
import type { WeightUnit } from "./weight-unit-toggle";

export const CM_PER_IN = 2.54;

export type HeightRulerConfig = {
  min: number;
  max: number;
  step: number;
  default: number;
};

export function roundToHeightStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function cmToInches(cm: number) {
  return roundToHeightStep(cm / CM_PER_IN, sizes.heightRulerStep);
}

export function getHeightRulerConfig(unit: WeightUnit): HeightRulerConfig {
  if (unit === "kg") {
    return {
      min: sizes.heightRulerMin,
      max: sizes.heightRulerMax,
      step: sizes.heightRulerStep,
      default: sizes.heightRulerDefault,
    };
  }

  const step = sizes.heightRulerStep;

  return {
    min: cmToInches(sizes.heightRulerMin),
    max: cmToInches(sizes.heightRulerMax),
    step,
    default: cmToInches(sizes.heightRulerDefault),
  };
}

export function clampHeight(value: number, config: HeightRulerConfig) {
  return Math.min(config.max, Math.max(config.min, value));
}

export function convertHeight(value: number, from: WeightUnit, to: WeightUnit) {
  if (from === to) {
    return value;
  }

  const cm = from === "kg" ? value : roundToHeightStep(value * CM_PER_IN, sizes.heightRulerStep);
  const config = getHeightRulerConfig(to);
  const converted = to === "kg" ? cm : cmToInches(cm);

  return clampHeight(converted, config);
}

export function indexToHeight(index: number, config: HeightRulerConfig) {
  return config.min + index * config.step;
}

export function heightToIndex(value: number, config: HeightRulerConfig) {
  return Math.round((value - config.min) / config.step);
}

export function formatHeightUnitLabel(unit: WeightUnit) {
  return unit === "kg" ? "Cm" : "In";
}
