import { addDays, startOfDay, subDays } from "date-fns";
import type { Contact, Deal, Sale, Task } from "../types";
import {
  buildBuckets,
  getPeriodRanges,
  isWithin,
  type DateRange,
  type PeriodId,
} from "./dashboardPeriods";

export const DORMANT_AFTER_DAYS = 45;
const WEEKS_OF_GROWTH = 8;
const TOP_LIST_SIZE = 5;

type SaleName = Pick<Sale, "id" | "first_name" | "last_name">;

export interface MetricsInput {
  deals: Deal[];
  contacts: Contact[];
  tasks: Task[];
  sales: SaleName[];
  /** Ordered pipeline stage values, from the first stage up to "won". */
  pipelineStages: string[];
  period: PeriodId;
  now?: Date;
}

export interface Comparison {
  value: number | null;
  previous: number | null;
}

export interface DashboardMetrics {
  newContacts: number;
  wonCount: number;
  conversion: Comparison;
  averageTicket: Comparison;
  wonAmount: { value: number; previous: number };
  overdueTasks: number;
  leads: { range: DateRange; value: number }[];
  flow: { range: DateRange; won: number; lost: number }[];
  portfolio: { salesId: Sale["id"] | null; name: string; contacts: number }[];
  team: {
    salesId: Sale["id"];
    name: string;
    won: number;
    lost: number;
    winRate: number | null;
  }[];
  followUp: {
    salesId: Sale["id"];
    name: string;
    onTimeRate: number | null;
    overdue: number;
  }[];
  funnel: { key: string; value: number }[];
  categories: { category: string; amount: number }[];
  dormant: {
    total: number;
    items: { contactId: Contact["id"]; name: string; lastSeen: string }[];
  };
  topClients: {
    contactId: Contact["id"];
    name: string;
    amount: number;
    purchases: number;
  }[];
  weeklyContacts: number[];
}

const fullName = (person: { first_name?: string; last_name?: string }) =>
  [person.first_name, person.last_name].filter(Boolean).join(" ");

const ratio = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : null;

const wonIn = (deals: Deal[], range: DateRange) =>
  deals.filter(
    (deal) =>
      deal.stage === "won" && isWithin(deal.expected_closing_date, range),
  );

const lostIn = (deals: Deal[], range: DateRange) =>
  deals.filter(
    (deal) =>
      deal.stage === "lost" && isWithin(deal.expected_closing_date, range),
  );

const sumAmount = (deals: Deal[]) =>
  deals.reduce((total, deal) => total + (deal.amount ?? 0), 0);

const contactsIn = (contacts: Contact[], range: DateRange) =>
  contacts.filter((contact) => isWithin(contact.first_seen, range));

export const computeDashboardMetrics = ({
  deals,
  contacts,
  tasks,
  sales,
  pipelineStages,
  period,
  now = new Date(),
}: MetricsInput): DashboardMetrics => {
  const { current, previous, definition } = getPeriodRanges(period, now);
  const salesNames = new Map(sales.map((sale) => [sale.id, fullName(sale)]));

  const won = wonIn(deals, current);
  const wonPrevious = wonIn(deals, previous);
  const newContacts = contactsIn(contacts, current).length;
  const newContactsPrevious = contactsIn(contacts, previous).length;

  const conversion: Comparison = {
    value: ratio(won.length, newContacts),
    previous: ratio(wonPrevious.length, newContactsPrevious),
  };
  const averageTicket: Comparison = {
    value: won.length ? sumAmount(won) / won.length : null,
    previous: wonPrevious.length
      ? sumAmount(wonPrevious) / wonPrevious.length
      : null,
  };

  const leads = buildBuckets(current, definition.leadsUnit).map((range) => ({
    range,
    value: contacts.filter((contact) => isWithin(contact.first_seen, range))
      .length,
  }));

  const flow = buildBuckets(current, definition.flowUnit).map((range) => ({
    range,
    won: sumAmount(wonIn(deals, range)),
    lost: sumAmount(lostIn(deals, range)),
  }));

  const portfolioCount = new Map<Sale["id"] | null, number>();
  contacts.forEach((contact) => {
    const key = contact.sales_id ?? null;
    portfolioCount.set(key, (portfolioCount.get(key) ?? 0) + 1);
  });
  const portfolio = [...portfolioCount.entries()]
    .map(([salesId, count]) => ({
      salesId,
      name: salesId == null ? "" : (salesNames.get(salesId) ?? ""),
      contacts: count,
    }))
    .sort((a, b) => b.contacts - a.contacts);

  const lost = lostIn(deals, current);
  const team = sales
    .map((sale) => {
      const salesWon = won.filter((deal) => deal.sales_id === sale.id).length;
      const salesLost = lost.filter((deal) => deal.sales_id === sale.id).length;
      return {
        salesId: sale.id,
        name: fullName(sale),
        won: salesWon,
        lost: salesLost,
        winRate: ratio(salesWon, salesWon + salesLost),
      };
    })
    .sort((a, b) => b.won - a.won);

  const nowTime = now.getTime();
  const isOverdue = (task: Task) =>
    !task.done_date && new Date(task.due_date).getTime() < nowTime;
  const followUp = sales
    .map((sale) => {
      const own = tasks.filter((task) => task.sales_id === sale.id);
      const dueInPeriod = own.filter(
        (task) =>
          isWithin(task.due_date, current) &&
          new Date(task.due_date).getTime() < nowTime,
      );
      const onTime = dueInPeriod.filter(
        (task) =>
          task.done_date &&
          startOfDay(new Date(task.done_date)) <=
            startOfDay(new Date(task.due_date)),
      );
      return {
        salesId: sale.id,
        name: fullName(sale),
        onTimeRate: ratio(onTime.length, dueInPeriod.length),
        overdue: own.filter(isOverdue).length,
      };
    })
    .sort((a, b) => (a.onTimeRate ?? 101) - (b.onTimeRate ?? 101));

  const createdInPeriod = deals.filter((deal) =>
    isWithin(deal.created_at, current),
  );
  const funnel = [
    { key: "contacts", value: newContacts },
    ...pipelineStages.map((stage, index) => ({
      key: stage,
      value: createdInPeriod.filter((deal) => {
        const reached = pipelineStages.indexOf(deal.stage);
        return index === 0 || reached >= index;
      }).length,
    })),
  ];

  const byCategory = new Map<string, number>();
  won.forEach((deal) =>
    byCategory.set(
      deal.category,
      (byCategory.get(deal.category) ?? 0) + (deal.amount ?? 0),
    ),
  );
  const categories = [...byCategory.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const dormantLimit = subDays(now, DORMANT_AFTER_DAYS).getTime();
  const dormantContacts = contacts
    .filter(
      (contact) =>
        contact.last_seen &&
        new Date(contact.last_seen).getTime() < dormantLimit,
    )
    .sort(
      (a, b) =>
        new Date(a.last_seen).getTime() - new Date(b.last_seen).getTime(),
    );

  const contactNames = new Map(
    contacts.map((contact) => [contact.id, fullName(contact)]),
  );
  const spent = new Map<Contact["id"], { amount: number; purchases: number }>();
  deals
    .filter((deal) => deal.stage === "won")
    .forEach((deal) =>
      (deal.contact_ids ?? []).forEach((contactId) => {
        const entry = spent.get(contactId) ?? { amount: 0, purchases: 0 };
        spent.set(contactId, {
          amount: entry.amount + (deal.amount ?? 0),
          purchases: entry.purchases + 1,
        });
      }),
    );
  const topClients = [...spent.entries()]
    .filter(([contactId]) => contactNames.has(contactId))
    .map(([contactId, entry]) => ({
      contactId,
      name: contactNames.get(contactId) ?? "",
      ...entry,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, TOP_LIST_SIZE);

  const tomorrow = addDays(startOfDay(now), 1);
  const weeklyContacts = Array.from({ length: WEEKS_OF_GROWTH }, (_, index) => {
    const end = subDays(tomorrow, 7 * (WEEKS_OF_GROWTH - 1 - index));
    return contactsIn(contacts, { start: subDays(end, 7), end }).length;
  });

  return {
    newContacts,
    wonCount: won.length,
    conversion,
    averageTicket,
    wonAmount: { value: sumAmount(won), previous: sumAmount(wonPrevious) },
    overdueTasks: tasks.filter(isOverdue).length,
    leads,
    flow,
    portfolio,
    team,
    followUp,
    funnel,
    categories,
    dormant: {
      total: dormantContacts.length,
      items: dormantContacts.slice(0, TOP_LIST_SIZE).map((contact) => ({
        contactId: contact.id,
        name: fullName(contact),
        lastSeen: contact.last_seen,
      })),
    },
    topClients,
    weeklyContacts,
  };
};
