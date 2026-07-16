import { sizes } from "@/styles/global";
import type { WeightUnit } from "./weight-unit-toggle";

export const KG_TO_LB = 2.2046226218;

export type WeightRulerConfig = {
  min: number;
  max: number;
  step: number;
  default: number;
};

export function roundToWeightStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function getWeightRulerConfig(unit: WeightUnit): WeightRulerConfig {
  if (unit === "kg") {
    return {
      min: sizes.weightRulerMin,
      max: sizes.weightRulerMax,
      step: sizes.weightRulerStep,
      default: sizes.weightRulerDefault,
    };
  }

  const step = sizes.weightRulerStep;

  return {
    min: roundToWeightStep(sizes.weightRulerMin * KG_TO_LB, step),
    max: roundToWeightStep(sizes.weightRulerMax * KG_TO_LB, step),
    step,
    default: roundToWeightStep(sizes.weightRulerDefault * KG_TO_LB, step),
  };
}

export function clampWeight(value: number, config: WeightRulerConfig) {
  return Math.min(config.max, Math.max(config.min, value));
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit) {
  if (from === to) {
    return value;
  }

  const config = getWeightRulerConfig(to);
  const converted = from === "kg" ? value * KG_TO_LB : value / KG_TO_LB;

  return clampWeight(roundToWeightStep(converted, config.step), config);
}

export function indexToWeight(index: number, config: WeightRulerConfig) {
  return config.min + index * config.step;
}

export function weightToIndex(value: number, config: WeightRulerConfig) {
  return Math.round((value - config.min) / config.step);
}
