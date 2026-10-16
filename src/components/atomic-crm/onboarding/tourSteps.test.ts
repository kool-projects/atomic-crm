import { describe, expect, it } from "vitest";

import { getDashboardTourSteps, getDealsTourSteps } from "./tourSteps";

describe("getDashboardTourSteps", () => {
  it("adds the team tab step only for admins", () => {
    const admin = getDashboardTourSteps({ isAdmin: true }).map((s) => s.id);
    const member = getDashboardTourSteps({ isAdmin: false }).map((s) => s.id);

    expect(admin).toContain("team");
    expect(member).not.toContain("team");
  });

  it("explains the filters differently for admins and members", () => {
    const filters = (isAdmin: boolean) =>
      getDashboardTourSteps({ isAdmin }).find((s) => s.id === "filters");

    expect(filters(true)?.descriptionKey).toMatch(/description_admin$/);
    expect(filters(false)?.descriptionKey).toMatch(/description_member$/);
  });

  it("opens with a message that points at nothing", () => {
    const [first] = getDashboardTourSteps({ isAdmin: true });

    expect(first.id).toBe("welcome");
    expect(first.selector).toBeUndefined();
  });

  it("keeps the tour short enough to finish", () => {
    expect(getDashboardTourSteps({ isAdmin: true }).length).toBeLessThanOrEqual(
      8,
    );
  });
});

describe("getDealsTourSteps", () => {
  it("teaches how to create the first deal when the board is empty", () => {
    const steps = getDealsTourSteps({ isEmpty: true }).map((s) => s.id);

    expect(steps).toEqual(["empty_intro", "empty_create"]);
  });

  it("walks through the views, the board, a card, sorting and the filters otherwise", () => {
    const steps = getDealsTourSteps({ isEmpty: false }).map((s) => s.id);

    expect(steps).toEqual([
      "views",
      "board",
      "card",
      "cooling",
      "sort",
      "filters",
      "new",
    ]);
  });

  it("gives every step its own title and description keys", () => {
    for (const isEmpty of [true, false]) {
      for (const s of getDealsTourSteps({ isEmpty })) {
        expect(s.titleKey).toContain(`.${s.id}.title`);
        expect(s.descriptionKey).toContain(`.${s.id}.description`);
      }
    }
  });
});
