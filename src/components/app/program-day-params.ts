export function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseDayNames(value: string | string[] | undefined): string[] {
  const raw = readSearchParam(value);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

export function serializeDayNames(dayNames: string[]) {
  return JSON.stringify(dayNames);
}
