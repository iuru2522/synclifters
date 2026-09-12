export const Platform = {
  OS: "web",
  select: <T extends Record<string, unknown>>(spec: T) =>
    (spec.web ?? spec.default) as T[keyof T],
};

export default {
  Platform,
};
