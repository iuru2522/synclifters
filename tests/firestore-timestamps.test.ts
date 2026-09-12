import { Timestamp } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { coerceToMillis, toDateKey } from "@/lib/firestore-timestamps";

describe("coerceToMillis", () => {
  it("maps finite numbers and Dates", () => {
    expect(coerceToMillis(1_700_000_000_000)).toBe(1_700_000_000_000);
    expect(coerceToMillis(new Date("2026-09-12T12:00:00.000Z"))).toBe(
      Date.parse("2026-09-12T12:00:00.000Z"),
    );
  });

  it("maps Firestore Timestamp", () => {
    const ts = Timestamp.fromMillis(1_700_000_000_000);
    expect(coerceToMillis(ts)).toBe(1_700_000_000_000);
  });

  it("returns null for invalid shapes", () => {
    expect(coerceToMillis(null)).toBeNull();
    expect(coerceToMillis(undefined)).toBeNull();
    expect(coerceToMillis("2026-09-12")).toBeNull();
    expect(coerceToMillis(Number.NaN)).toBeNull();
  });
});

describe("toDateKey", () => {
  it("formats local yyyy-mm-dd", () => {
    const date = new Date(2026, 8, 12);
    expect(toDateKey(date)).toBe("2026-09-12");
  });
});
