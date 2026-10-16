import { describe, expect, it } from "vitest";

import type { Contact, Deal, Task } from "../types";
import { computeDashboardMetrics } from "./dashboardMetrics";
import { buildBuckets, getPeriodRanges } from "./dashboardPeriods";

const NOW = new Date("2026-10-15T12:00:00Z");
const STAGES = ["opportunity", "proposal-sent", "in-negociation", "won"];
const SALES = [
  { id: 1, first_name: "Marina", last_name: "Costa" },
  { id: 2, first_name: "Camila", last_name: "Duarte" },
];

const deal = (overrides: Partial<Deal>): Deal =>
  ({
    id: 1,
    name: "Deal",
    category: "botox",
    stage: "opportunity",
    amount: 1000,
    created_at: "2026-10-01T10:00:00Z",
    expected_closing_date: "2026-10-10",
    contact_ids: [],
    sales_id: 1,
    ...overrides,
  }) as Deal;

const contact = (overrides: Partial<Contact>): Contact =>
  ({
    id: 1,
    first_name: "Ana",
    last_name: "Lima",
    first_seen: "2026-10-05T10:00:00Z",
    last_seen: "2026-10-05T10:00:00Z",
    sales_id: 1,
    ...overrides,
  }) as Contact;

const task = (overrides: Partial<Task>): Task =>
  ({
    id: 1,
    due_date: "2026-10-10T12:00:00Z",
    done_date: null,
    sales_id: 1,
    ...overrides,
  }) as Task;

const compute = (input: {
  deals?: Deal[];
  contacts?: Contact[];
  tasks?: Task[];
  period?: "7d" | "30d" | "90d" | "6m" | "12m";
}) =>
  computeDashboardMetrics({
    deals: input.deals ?? [],
    contacts: input.contacts ?? [],
    tasks: input.tasks ?? [],
    sales: SALES,
    pipelineStages: STAGES,
    period: input.period ?? "30d",
    now: NOW,
  });

describe("computeDashboardMetrics", () => {
  it("computes lead conversion as won deals over new contacts in the period", () => {
    const metrics = compute({
      contacts: [1, 2, 3, 4].map((id) => contact({ id })),
      deals: [
        deal({ id: 1, stage: "won" }),
        deal({ id: 2, stage: "won", amount: 3000 }),
      ],
    });

    expect(metrics.newContacts).toBe(4);
    expect(metrics.conversion.value).toBe(50);
    expect(metrics.averageTicket.value).toBe(2000);
    expect(metrics.wonAmount.value).toBe(4000);
  });

  it("dates a sale by its closing date, not by its creation date", () => {
    const metrics = compute({
      deals: [
        deal({
          stage: "won",
          created_at: "2026-01-01T10:00:00Z",
          expected_closing_date: "2026-10-12",
        }),
        deal({
          id: 2,
          stage: "won",
          created_at: "2026-10-01T10:00:00Z",
          expected_closing_date: "2026-06-01",
        }),
      ],
    });

    expect(metrics.wonCount).toBe(1);
  });

  it("returns no conversion when there are no new contacts", () => {
    const metrics = compute({ deals: [deal({ stage: "won" })] });

    expect(metrics.conversion.value).toBeNull();
  });

  it("ranks collaborators by wins and reports each win rate", () => {
    const metrics = compute({
      deals: [
        deal({ id: 1, stage: "won", sales_id: 2 }),
        deal({ id: 2, stage: "won", sales_id: 2 }),
        deal({ id: 3, stage: "lost", sales_id: 2 }),
        deal({ id: 4, stage: "won", sales_id: 1 }),
        deal({ id: 5, stage: "lost", sales_id: 1 }),
        deal({ id: 6, stage: "lost", sales_id: 1 }),
      ],
    });

    expect(metrics.team.map((row) => row.name)).toEqual([
      "Camila Duarte",
      "Marina Costa",
    ]);
    expect(metrics.team[0]).toMatchObject({ won: 2, lost: 1 });
    expect(metrics.team[0].winRate).toBeCloseTo(66.67, 1);
    expect(metrics.team[1].lost).toBe(2);
  });

  it("counts a deal in a funnel step only once it reached that stage", () => {
    const metrics = compute({
      contacts: [contact({ id: 1 }), contact({ id: 2 })],
      deals: [
        deal({ id: 1, stage: "opportunity" }),
        deal({ id: 2, stage: "proposal-sent" }),
        deal({ id: 3, stage: "won" }),
        deal({ id: 4, stage: "lost" }),
      ],
    });

    const byKey = Object.fromEntries(
      metrics.funnel.map((step) => [step.key, step.value]),
    );
    expect(byKey).toEqual({
      contacts: 2,
      opportunity: 4,
      "proposal-sent": 2,
      "in-negociation": 1,
      won: 1,
    });
  });

  it("lists contacts without news for more than 45 days, oldest first", () => {
    const metrics = compute({
      contacts: [
        contact({ id: 1, last_seen: "2026-09-20T10:00:00Z" }),
        contact({ id: 2, last_seen: "2026-08-01T10:00:00Z" }),
        contact({ id: 3, last_seen: "2026-05-01T10:00:00Z" }),
      ],
    });

    expect(metrics.dormant.total).toBe(2);
    expect(metrics.dormant.items.map((item) => item.contactId)).toEqual([3, 2]);
  });

  it("measures follow-up on time and counts overdue open tasks", () => {
    const metrics = compute({
      tasks: [
        task({ id: 1, done_date: "2026-10-09T09:00:00Z" }),
        task({ id: 2, done_date: "2026-10-14T09:00:00Z" }),
        task({ id: 3, done_date: null }),
        task({ id: 4, done_date: null, due_date: "2026-10-30T12:00:00Z" }),
      ],
    });

    const marina = metrics.followUp.find((row) => row.name === "Marina Costa");
    expect(marina?.onTimeRate).toBeCloseTo(33.33, 1);
    expect(marina?.overdue).toBe(1);
    expect(metrics.overdueTasks).toBe(1);
  });

  it("ranks the clients who spent the most across their won deals", () => {
    const metrics = compute({
      contacts: [contact({ id: 1 }), contact({ id: 2, first_name: "Bia" })],
      deals: [
        deal({ id: 1, stage: "won", amount: 500, contact_ids: [1] }),
        deal({ id: 2, stage: "won", amount: 2500, contact_ids: [2] }),
        deal({ id: 3, stage: "won", amount: 700, contact_ids: [1] }),
        deal({ id: 4, stage: "lost", amount: 9000, contact_ids: [1] }),
      ],
    });

    expect(metrics.topClients.map((client) => client.name)).toEqual([
      "Bia Lima",
      "Ana Lima",
    ]);
    expect(metrics.topClients[1]).toMatchObject({ amount: 1200, purchases: 2 });
  });
});

describe("period buckets", () => {
  it("splits 30 days into weekly buckets that cover the whole range", () => {
    const { current } = getPeriodRanges("30d", NOW);
    const buckets = buildBuckets(current, "week");

    expect(buckets[0].start.getTime()).toBe(current.start.getTime());
    expect(buckets[buckets.length - 1].end.getTime()).toBe(
      current.end.getTime(),
    );
    expect(buckets).toHaveLength(5);
  });

  it("compares against an equally long previous period", () => {
    const { current, previous } = getPeriodRanges("7d", NOW);

    expect(previous.end.getTime()).toBe(current.start.getTime());
    expect(current.end.getTime() - current.start.getTime()).toBe(
      previous.end.getTime() - previous.start.getTime(),
    );
  });
});
