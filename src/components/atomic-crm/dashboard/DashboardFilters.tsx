import { useTranslate } from "ra-core";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PERIODS, isPeriodId, type PeriodId } from "./dashboardPeriods";
import { SalespersonSelect } from "../sales/SalespersonSelect";
import type { SalespersonOption } from "../sales/useSalesScope";

interface DashboardFiltersProps {
  period: PeriodId;
  onPeriodChange: (period: PeriodId) => void;
  salesId: string;
  onSalesIdChange: (salesId: string) => void;
  salespeople: SalespersonOption[];
  /** Only admins choose whose figures to look at. */
  canPickSalesperson: boolean;
}

export const DashboardFilters = ({
  period,
  onPeriodChange,
  salesId,
  onSalesIdChange,
  salespeople,
  canPickSalesperson,
}: DashboardFiltersProps) => {
  const translate = useTranslate();

  return (
    <div
      data-tour="dashboard-filters"
      className="flex w-full flex-wrap items-center gap-2 sm:w-auto"
    >
      {canPickSalesperson ? (
        <SalespersonSelect
          value={salesId}
          onChange={onSalesIdChange}
          salespeople={salespeople}
          className="w-full sm:w-[200px]"
        />
      ) : (
        <span className="text-sm text-muted-foreground">
          {translate("crm.dashboard.filters.only_yours")}
        </span>
      )}
      <Select
        value={period}
        onValueChange={(value) => isPeriodId(value) && onPeriodChange(value)}
      >
        <SelectTrigger
          className="w-full sm:w-[190px]"
          aria-label={translate("crm.dashboard.filters.period")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map(({ id }) => (
            <SelectItem key={id} value={id}>
              {translate(`crm.dashboard.filters.periods.${id}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
