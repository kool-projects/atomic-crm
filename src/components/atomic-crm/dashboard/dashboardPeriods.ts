import {
  addDays,
  addMonths,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

export type PeriodId = "7d" | "30d" | "90d" | "6m" | "12m";
export type BucketUnit = "day" | "week" | "month";

/** `end` is exclusive. */
export interface DateRange {
  start: Date;
  end: Date;
}

interface PeriodDefinition {
  id: PeriodId;
  days?: number;
  months?: number;
  leadsUnit: BucketUnit;
  flowUnit: BucketUnit;
}

export const PERIODS: PeriodDefinition[] = [
  { id: "7d", days: 7, leadsUnit: "day", flowUnit: "day" },
  { id: "30d", days: 30, leadsUnit: "day", flowUnit: "week" },
  { id: "90d", days: 90, leadsUnit: "week", flowUnit: "week" },
  { id: "6m", months: 6, leadsUnit: "week", flowUnit: "month" },
  { id: "12m", months: 12, leadsUnit: "month", flowUnit: "month" },
];

export const DEFAULT_PERIOD: PeriodId = "30d";

export const isPeriodId = (value: unknown): value is PeriodId =>
  PERIODS.some((period) => period.id === value);

export const getPeriodRanges = (id: PeriodId, now: Date = new Date()) => {
  const definition = PERIODS.find((period) => period.id === id) ?? PERIODS[1];
  const end = addDays(startOfDay(now), 1);
  const shift = (from: Date) =>
    definition.days != null
      ? subDays(from, definition.days)
      : subMonths(from, definition.months!);
  const start = shift(end);
  return {
    definition,
    current: { start, end } satisfies DateRange,
    previous: { start: shift(start), end: start } satisfies DateRange,
  };
};

export const isWithin = (date: string | undefined | null, range: DateRange) => {
  if (!date) return false;
  const time = new Date(date).getTime();
  return time >= range.start.getTime() && time < range.end.getTime();
};

/** Split a range into consecutive buckets. Months follow the calendar. */
export const buildBuckets = (
  range: DateRange,
  unit: BucketUnit,
): DateRange[] => {
  const buckets: DateRange[] = [];
  let cursor = range.start;
  while (cursor < range.end) {
    const next =
      unit === "day"
        ? addDays(cursor, 1)
        : unit === "week"
          ? addDays(cursor, 7)
          : addMonths(startOfMonth(cursor), 1);
    buckets.push({ start: cursor, end: next > range.end ? range.end : next });
    cursor = next;
  }
  return buckets;
};
