import { useStore, useTranslate } from "ra-core";

import { useIsMobile } from "@/hooks/use-mobile";

import { MobileContent } from "../layout/MobileContent";
import MobileHeader from "../layout/MobileHeader";
import { crmIcons } from "../misc/crmIcons";
import { SalespersonSelect } from "../sales/SalespersonSelect";
import { ALL_SALES, useSalesScope } from "../sales/useSalesScope";
import { TasksCalendar } from "./TasksCalendar";

const CalendarBody = ({ showTitle }: { showTitle: boolean }) => {
  const translate = useTranslate();
  const [salesId, setSalesId] = useStore<string>("calendar.salesId", ALL_SALES);
  const scope = useSalesScope(salesId);

  return (
    <div className="flex flex-col gap-4 mt-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showTitle ? (
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <crmIcons.calendar className="size-6 text-primary" />
            {translate("crm.calendar.title")}
          </h1>
        ) : null}
        {scope.isAdmin ? (
          <SalespersonSelect
            value={salesId}
            onChange={setSalesId}
            salespeople={scope.salespeople}
            className="w-full sm:w-[220px]"
          />
        ) : (
          <span className="text-sm text-muted-foreground">
            {translate("crm.dashboard.filters.only_yours")}
          </span>
        )}
      </div>
      <TasksCalendar salesId={salesId} variant="full" />
    </div>
  );
};

/** The team's tasks on a calendar. Desktop and mobile share the same body. */
export const CalendarPage = () => {
  const translate = useTranslate();
  const isMobile = useIsMobile();

  if (!isMobile) return <CalendarBody showTitle />;

  return (
    <>
      <MobileHeader showRefresh>
        <h1 className="text-xl font-semibold">
          {translate("crm.calendar.title")}
        </h1>
      </MobileHeader>
      <MobileContent>
        <CalendarBody showTitle={false} />
      </MobileContent>
    </>
  );
};

CalendarPage.path = "/calendar";
