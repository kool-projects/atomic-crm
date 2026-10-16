import { describe, expect, it } from "vitest";

import { getCooling, getLastInteraction, isDealClosed } from "./dealCooling";

const NOW = new Date("2026-10-15T12:00:00Z");
const hoursAgo = (hours: number) =>
  new Date(NOW.getTime() - hours * 60 * 60 * 1000);

describe("getCooling", () => {
  it("is not cold within two days of the last interaction", () => {
    expect(getCooling(hoursAgo(47), NOW).isCold).toBe(false);
    expect(getCooling(hoursAgo(48), NOW).isCold).toBe(false);
  });

  it("turns cold once the last interaction is more than two days old", () => {
    expect(getCooling(hoursAgo(49), NOW).isCold).toBe(true);
  });

  it("counts whole days since the last interaction", () => {
    expect(getCooling(hoursAgo(5), NOW).days).toBe(0);
    expect(getCooling(hoursAgo(30), NOW).days).toBe(1);
    expect(getCooling(hoursAgo(24 * 7 + 3), NOW).days).toBe(7);
  });

  it("never reports a negative age for a date in the future", () => {
    expect(getCooling(hoursAgo(-5), NOW)).toEqual({ days: 0, isCold: false });
  });
});

describe("getLastInteraction", () => {
  const deal = {
    created_at: "2026-09-01T10:00:00Z",
    updated_at: "2026-09-02T10:00:00Z",
  };

  it("takes the most recent of deal, note and client activity", () => {
    const last = getLastInteraction({
      deal,
      lastNoteDate: "2026-10-10T09:00:00Z",
      contactLastSeen: "2026-10-12T09:00:00Z",
    });

    expect(last?.toISOString()).toBe("2026-10-12T09:00:00.000Z");
  });

  it("falls back to the deal dates when nothing else happened", () => {
    expect(getLastInteraction({ deal })?.toISOString()).toBe(
      "2026-09-02T10:00:00.000Z",
    );
  });

  it("ignores missing and invalid dates", () => {
    const last = getLastInteraction({
      deal,
      lastNoteDate: "not a date",
      contactLastSeen: null,
    });

    expect(last?.toISOString()).toBe("2026-09-02T10:00:00.000Z");
  });

  it("returns null when no date is usable", () => {
    expect(
      getLastInteraction({ deal: { created_at: "", updated_at: "" } }),
    ).toBeNull();
  });
});

describe("isDealClosed", () => {
  it("treats won, lost and archived deals as closed", () => {
    expect(isDealClosed({ stage: "won" })).toBe(true);
    expect(isDealClosed({ stage: "lost" })).toBe(true);
    expect(
      isDealClosed({
        stage: "opportunity",
        archived_at: "2026-10-01T00:00:00Z",
      }),
    ).toBe(true);
  });

  it("keeps in-progress and delayed deals open", () => {
    expect(isDealClosed({ stage: "in-negociation" })).toBe(false);
    expect(isDealClosed({ stage: "delayed" })).toBe(false);
  });
});
