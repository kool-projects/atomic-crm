import type { EventInput } from "@fullcalendar/core";
import { addMinutes } from "date-fns";

import type { SalespersonOption } from "../sales/useSalesScope";
import type { Contact, Task } from "../types";

/** Tasks have a start time only: show each as a short block. */
export const EVENT_DURATION_MINUTES = 30;
/** How many colours the calendar cycles through for salespeople. */
export const SERIES_COUNT = 5;

export interface TaskEventProps {
  taskId: Task["id"];
  contactId: Task["contact_id"];
  isDone: boolean;
  salespersonName: string | null;
}

export const tasksToCalendarEvents = ({
  tasks,
  contactNames,
  salespeople,
}: {
  tasks: Task[];
  contactNames: Map<Contact["id"], string>;
  salespeople: SalespersonOption[];
}): EventInput[] => {
  const seriesBySales = new Map(
    salespeople.map((person, index) => [person.id, index % SERIES_COUNT]),
  );
  const nameBySales = new Map(
    salespeople.map((person) => [person.id, person.name]),
  );

  return tasks.flatMap((task) => {
    const start = new Date(task.due_date);
    if (Number.isNaN(start.getTime())) return [];

    const contactName = contactNames.get(task.contact_id);
    const text = task.text || task.type;
    const isDone = Boolean(task.done_date);
    const series =
      task.sales_id != null ? (seriesBySales.get(task.sales_id) ?? 0) : 0;

    return [
      {
        id: String(task.id),
        title: contactName ? `${contactName} · ${text}` : text,
        start,
        end: addMinutes(start, EVENT_DURATION_MINUTES),
        classNames: [`crm-series-${series}`, ...(isDone ? ["is-done"] : [])],
        extendedProps: {
          taskId: task.id,
          contactId: task.contact_id,
          isDone,
          salespersonName:
            task.sales_id != null
              ? (nameBySales.get(task.sales_id) ?? null)
              : null,
        } satisfies TaskEventProps,
      },
    ];
  });
};
