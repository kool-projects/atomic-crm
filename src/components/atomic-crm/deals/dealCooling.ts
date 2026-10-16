import type { Deal } from "../types";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** A card turns red once its last interaction is older than this. */
export const COOLING_ALERT_AFTER_HOURS = 48;

const CLOSED_STAGES = ["won", "lost"];

/** Won, lost and archived deals are done: they cannot "cool down". */
export const isDealClosed = (deal: Pick<Deal, "stage" | "archived_at">) =>
  CLOSED_STAGES.includes(deal.stage) || Boolean(deal.archived_at);

const toTime = (value: string | null | undefined) => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

/**
 * The most recent sign of life on a card: the deal itself being created,
 * moved or edited, a note written on the deal, or news from its client.
 */
export const getLastInteraction = ({
  deal,
  lastNoteDate,
  contactLastSeen,
}: {
  deal: Pick<Deal, "created_at" | "updated_at">;
  lastNoteDate?: string | null;
  contactLastSeen?: string | null;
}): Date | null => {
  const times = [
    deal.created_at,
    deal.updated_at,
    lastNoteDate,
    contactLastSeen,
  ]
    .map(toTime)
    .filter((time): time is number => time != null);
  return times.length ? new Date(Math.max(...times)) : null;
};

export const getCooling = (lastInteraction: Date, now: Date = new Date()) => {
  const elapsed = Math.max(0, now.getTime() - lastInteraction.getTime());
  return {
    days: Math.floor(elapsed / DAY_MS),
    isCold: elapsed > COOLING_ALERT_AFTER_HOURS * HOUR_MS,
  };
};
