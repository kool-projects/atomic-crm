import type { Deal } from "../types";

export type DealSortId =
  | "manual"
  | "cooling"
  | "newest"
  | "oldest"
  | "value"
  | "closing"
  | "client";

/** In the order they are offered in the column menu. */
export const DEAL_SORT_OPTIONS: DealSortId[] = [
  "manual",
  "cooling",
  "newest",
  "oldest",
  "value",
  "closing",
  "client",
];

export const DEFAULT_DEAL_SORT: DealSortId = "manual";

export const isDealSortId = (value: unknown): value is DealSortId =>
  DEAL_SORT_OPTIONS.includes(value as DealSortId);

export interface DealSortContext {
  lastInteraction: Map<Deal["id"], Date | null>;
  clientNames: Map<Deal["id"], string>;
}

const time = (value: string | null | undefined) => {
  if (!value) return null;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};

/** Ascending, with missing values always last. */
const byAscending = (a: number | null, b: number | null) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a - b;
};

/**
 * A new array in the requested order. "manual" keeps the order people set by
 * dragging. Ties are broken by that manual order, so the result is stable.
 */
export const sortDeals = (
  deals: Deal[],
  sortId: DealSortId,
  context: DealSortContext,
): Deal[] => {
  if (sortId === "manual") return [...deals];

  const manualRank = new Map(deals.map((deal, index) => [deal.id, index]));
  const tieBreak = (a: Deal, b: Deal) =>
    (manualRank.get(a.id) ?? 0) - (manualRank.get(b.id) ?? 0);

  const compare = (a: Deal, b: Deal): number => {
    switch (sortId) {
      case "cooling":
        return byAscending(
          context.lastInteraction.get(a.id)?.getTime() ?? null,
          context.lastInteraction.get(b.id)?.getTime() ?? null,
        );
      case "newest":
        return byAscending(time(b.created_at), time(a.created_at));
      case "oldest":
        return byAscending(time(a.created_at), time(b.created_at));
      case "value":
        return (b.amount ?? 0) - (a.amount ?? 0);
      case "closing":
        return byAscending(
          time(a.expected_closing_date),
          time(b.expected_closing_date),
        );
      case "client":
        return (context.clientNames.get(a.id) ?? a.name).localeCompare(
          context.clientNames.get(b.id) ?? b.name,
        );
      default:
        return 0;
    }
  };

  return [...deals].sort((a, b) => compare(a, b) || tieBreak(a, b));
};
