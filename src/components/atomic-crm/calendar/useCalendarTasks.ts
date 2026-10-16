import { useGetList, useGetMany } from "ra-core";
import { useMemo } from "react";

import { useSalesScope } from "../sales/useSalesScope";
import type { Contact, Task } from "../types";
import { tasksToCalendarEvents } from "./calendarEvents";

/** Largest page the backend returns. Longer lists are flagged to the user. */
export const CALENDAR_FETCH_LIMIT = 1000;

/**
 * The tasks to put on the calendar, as events. Admins see everyone's tasks or
 * one salesperson's. Anyone else sees only their own.
 */
export const useCalendarTasks = (selectedSalesId: string) => {
  const scope = useSalesScope(selectedSalesId);
  const filter =
    scope.scopedSalesId != null ? { sales_id: scope.scopedSalesId } : {};

  // Newest first, so the limit cuts the oldest tasks, never the upcoming ones.
  const tasks = useGetList<Task>(
    "tasks",
    {
      pagination: { page: 1, perPage: CALENDAR_FETCH_LIMIT },
      sort: { field: "due_date", order: "DESC" },
      filter,
    },
    { enabled: scope.isLoaded },
  );

  const contactIds = useMemo(
    () => [...new Set((tasks.data ?? []).map((task) => task.contact_id))],
    [tasks.data],
  );
  const contacts = useGetMany<Contact>(
    "contacts",
    { ids: contactIds },
    { enabled: contactIds.length > 0 },
  );

  const events = useMemo(() => {
    const contactNames = new Map(
      (contacts.data ?? []).map((contact) => [
        contact.id,
        `${contact.first_name} ${contact.last_name}`.trim(),
      ]),
    );
    return tasksToCalendarEvents({
      tasks: tasks.data ?? [],
      contactNames,
      salespeople: scope.salespeople,
    });
  }, [tasks.data, contacts.data, scope.salespeople]);

  return {
    events,
    isAdmin: scope.isAdmin,
    salespeople: scope.salespeople,
    scopedSalesId: scope.scopedSalesId,
    isPending: !scope.isLoaded || tasks.isPending,
    truncated: tasks.total != null && tasks.total > (tasks.data?.length ?? 0),
  };
};
