import { describe, expect, it } from "vitest";

import type { Deal } from "../types";
import { sortDeals, type DealSortContext } from "./dealSorting";

const deal = (id: number, overrides: Partial<Deal> = {}): Deal =>
  ({
    id,
    name: `Deal ${id}`,
    amount: 1000,
    created_at: "2026-10-01T10:00:00Z",
    expected_closing_date: "2026-11-01",
    index: id,
    ...overrides,
  }) as Deal;

const ids = (deals: Deal[]) => deals.map((d) => d.id);

const emptyContext: DealSortContext = {
  lastInteraction: new Map(),
  clientNames: new Map(),
};

describe("sortDeals", () => {
  it("keeps the dragged order when sorting is manual", () => {
    const deals = [deal(3), deal(1), deal(2)];

    expect(ids(sortDeals(deals, "manual", emptyContext))).toEqual([3, 1, 2]);
  });

  it("puts the deals longest without contact first", () => {
    const context: DealSortContext = {
      ...emptyContext,
      lastInteraction: new Map([
        [1, new Date("2026-10-14T10:00:00Z")],
        [2, new Date("2026-10-01T10:00:00Z")],
        [3, new Date("2026-10-10T10:00:00Z")],
      ]),
    };

    expect(
      ids(sortDeals([deal(1), deal(2), deal(3)], "cooling", context)),
    ).toEqual([2, 3, 1]);
  });

  it("puts deals with no known interaction after the ones with one", () => {
    const context: DealSortContext = {
      ...emptyContext,
      lastInteraction: new Map([
        [2, new Date("2026-10-14T10:00:00Z")],
        [1, null],
      ]),
    };

    expect(ids(sortDeals([deal(1), deal(2)], "cooling", context))).toEqual([
      2, 1,
    ]);
  });

  it("orders by creation date, newest or oldest first", () => {
    const deals = [
      deal(1, { created_at: "2026-10-05T00:00:00Z" }),
      deal(2, { created_at: "2026-10-09T00:00:00Z" }),
      deal(3, { created_at: "2026-10-01T00:00:00Z" }),
    ];

    expect(ids(sortDeals(deals, "newest", emptyContext))).toEqual([2, 1, 3]);
    expect(ids(sortDeals(deals, "oldest", emptyContext))).toEqual([3, 1, 2]);
  });

  it("puts the biggest value first", () => {
    const deals = [
      deal(1, { amount: 2000 }),
      deal(2, { amount: 9000 }),
      deal(3, { amount: 500 }),
    ];

    expect(ids(sortDeals(deals, "value", emptyContext))).toEqual([2, 1, 3]);
  });

  it("puts the closest closing date first and undated deals last", () => {
    const deals = [
      deal(1, { expected_closing_date: "2026-12-01" }),
      deal(2, { expected_closing_date: undefined }),
      deal(3, { expected_closing_date: "2026-11-05" }),
    ];

    expect(ids(sortDeals(deals, "closing", emptyContext))).toEqual([3, 1, 2]);
  });

  it("sorts by client name A to Z, falling back to the deal name", () => {
    const context: DealSortContext = {
      ...emptyContext,
      clientNames: new Map([
        [1, "Vanessa Cardoso"],
        [2, "Aline Siqueira"],
      ]),
    };

    expect(
      ids(
        sortDeals(
          [deal(1), deal(2), deal(3, { name: "Zed" })],
          "client",
          context,
        ),
      ),
    ).toEqual([2, 1, 3]);
  });

  it("keeps the manual order between equal values", () => {
    const deals = [deal(2), deal(1), deal(3)];

    expect(ids(sortDeals(deals, "value", emptyContext))).toEqual([2, 1, 3]);
  });

  it("does not change the array it was given", () => {
    const deals = [deal(1, { amount: 1 }), deal(2, { amount: 5 })];
    sortDeals(deals, "value", emptyContext);

    expect(ids(deals)).toEqual([1, 2]);
  });
});
