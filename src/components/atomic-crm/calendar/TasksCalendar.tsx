import frLocale from "@fullcalendar/core/locales/fr";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useLocale, useTranslate } from "ra-core";
import { useNavigate } from "react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { SERIES_COUNT, type TaskEventProps } from "./calendarEvents";
import { CALENDAR_FETCH_LIMIT, useCalendarTasks } from "./useCalendarTasks";

const SWATCH_BY_SERIES = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

const FULL_VIEWS = "dayGridMonth,timeGridWeek,timeGridDay,listWeek";

const toCalendarLocale = (locale: string) =>
  locale === "pt-BR" ? "pt-br" : locale === "fr" ? "fr" : "en";

interface TasksCalendarProps {
  /** "all" or a salesperson id. Ignored for people who only see their own. */
  salesId: string;
  /** "full": month, week, day and list. "day": today's agenda, compact. */
  variant: "full" | "day";
}

/** The team's tasks on a calendar, coloured by salesperson. */
export const TasksCalendar = ({ salesId, variant }: TasksCalendarProps) => {
  const translate = useTranslate();
  const locale = useLocale();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const data = useCalendarTasks(salesId);

  if (data.isPending) {
    return <Skeleton className="h-96 w-full" />;
  }

  const isDay = variant === "day";
  const showLegend = data.isAdmin && data.scopedSalesId == null;

  return (
    <div className="flex flex-col gap-3">
      {data.truncated ? (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {translate("crm.calendar.truncated", { count: CALENDAR_FETCH_LIMIT })}
        </p>
      ) : null}
      {showLegend && data.salespeople.length > 1 ? (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {data.salespeople.map((person, index) => (
            <li key={String(person.id)} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-2.5 rounded-sm",
                  SWATCH_BY_SERIES[index % SERIES_COUNT],
                )}
              />
              {person.name}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="crm-calendar rounded-xl border bg-card p-3">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          locales={[frLocale, ptBrLocale]}
          locale={toCalendarLocale(locale)}
          initialView={
            isDay ? "timeGridDay" : isMobile ? "listWeek" : "dayGridMonth"
          }
          headerToolbar={
            isDay
              ? { left: "prev,next today", center: "title", right: "" }
              : isMobile
                ? { left: "prev,next", center: "title", right: "today" }
                : {
                    left: "prev,next today",
                    center: "title",
                    right: FULL_VIEWS,
                  }
          }
          events={data.events}
          eventClick={(info) => {
            info.jsEvent.preventDefault();
            const { contactId } = info.event.extendedProps as TaskEventProps;
            navigate(`/contacts/${contactId}/show`);
          }}
          height={isDay ? 560 : "auto"}
          allDaySlot={false}
          nowIndicator
          navLinks={!isDay}
          dayMaxEvents={3}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          scrollTime="08:00:00"
          displayEventEnd={false}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          noEventsContent={translate("crm.calendar.empty")}
        />
      </div>
    </div>
  );
};
