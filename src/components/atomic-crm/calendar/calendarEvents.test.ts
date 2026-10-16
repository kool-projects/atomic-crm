import { describe, expect, it } from "vitest";

import type { Task } from "../types";
import {
  EVENT_DURATION_MINUTES,
  tasksToCalendarEvents,
  type TaskEventProps,
} from "./calendarEvents";

const SALESPEOPLE = [
  { id: 1, name: "Marina Costa" },
  { id: 2, name: "Camila Duarte" },
];

const task = (overrides: Partial<Task>): Task =>
  ({
    id: 10,
    contact_id: 100,
    type: "call",
    text: "Call back",
    due_date: "2026-10-15T14:00:00.000Z",
    done_date: null,
    sales_id: 1,
    ...overrides,
  }) as Task;

const toEvents = (tasks: Task[]) =>
  tasksToCalendarEvents({
    tasks,
    contactNames: new Map([[100, "Helena Barros"]]),
    salespeople: SALESPEOPLE,
  });

describe("tasksToCalendarEvents", () => {
  it("names the event after the client and the task", () => {
    const [event] = toEvents([task({})]);

    expect(event.title).toBe("Helena Barros · Call back");
  });

  it("gives every task a block that starts at its due time", () => {
    const [event] = toEvents([task({})]);

    const start = new Date(event.start as Date).getTime();
    const end = new Date(event.end as Date).getTime();
    expect(start).toBe(new Date("2026-10-15T14:00:00.000Z").getTime());
    expect(end - start).toBe(EVENT_DURATION_MINUTES * 60 * 1000);
  });

  it("marks finished tasks so they can be shown faded", () => {
    const [open, done] = toEvents([
      task({ id: 1 }),
      task({ id: 2, done_date: "2026-10-15T15:00:00.000Z" }),
    ]);

    expect(open.classNames).not.toContain("is-done");
    expect(done.classNames).toContain("is-done");
  });

  it("colours each salesperson's tasks in their own series", () => {
    const [first, second] = toEvents([
      task({ id: 1, sales_id: 1 }),
      task({ id: 2, sales_id: 2 }),
    ]);

    expect(first.classNames).toContain("crm-series-0");
    expect(second.classNames).toContain("crm-series-1");
    expect((second.extendedProps as TaskEventProps).salespersonName).toBe(
      "Camila Duarte",
    );
  });

  it("falls back to the task type when the text is empty", () => {
    const [event] = tasksToCalendarEvents({
      tasks: [task({ text: "" })],
      contactNames: new Map(),
      salespeople: SALESPEOPLE,
    });

    expect(event.title).toBe("call");
  });

  it("skips tasks whose due date cannot be read", () => {
    const events = toEvents([
      task({ due_date: "not a date" }),
      task({ id: 11 }),
    ]);

    expect(events).toHaveLength(1);
  });
});
