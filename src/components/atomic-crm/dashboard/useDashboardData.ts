import { useGetList } from "ra-core";
import { useMemo } from "react";

import { useConfigurationContext } from "../root/ConfigurationContext";
import {
  ALL_SALES,
  useSalesScope,
  type SalespersonOption,
} from "../sales/useSalesScope";
import type { Contact, Deal, Sale, Task } from "../types";
import {
  computeDashboardMetrics,
  type DashboardMetrics,
} from "./dashboardMetrics";
import type { PeriodId } from "./dashboardPeriods";

/** Largest page the backend returns. Lists longer than this are flagged. */
export const DASHBOARD_FETCH_LIMIT = 1000;

const PAGE = { page: 1, perPage: DASHBOARD_FETCH_LIMIT };
const BY_ID = { field: "id", order: "ASC" } as const;

export { ALL_SALES };
export type { SalespersonOption };

export interface DashboardData {
  isPending: boolean;
  /** Admins can pick a salesperson. Everyone else only sees their own data. */
  isAdmin: boolean;
  salespeople: SalespersonOption[];
  /** The salesperson the figures are limited to, if any. */
  scopedSalesId: Sale["id"] | undefined;
  metrics: DashboardMetrics | undefined;
  truncated: boolean;
}

export const useDashboardData = ({
  period,
  salesId,
}: {
  period: PeriodId;
  salesId: string;
}): DashboardData => {
  const { dealStages } = useConfigurationContext();
  const { isAdmin, salespeople, scopedSalesId, isLoaded } =
    useSalesScope(salesId);

  const filter = scopedSalesId != null ? { sales_id: scopedSalesId } : {};
  const enabled = isLoaded;

  const deals = useGetList<Deal>(
    "deals",
    { pagination: PAGE, sort: BY_ID, filter },
    { enabled },
  );
  const contacts = useGetList<Contact>(
    "contacts",
    { pagination: PAGE, sort: BY_ID, filter },
    { enabled },
  );
  const tasks = useGetList<Task>(
    "tasks",
    { pagination: PAGE, sort: BY_ID, filter },
    { enabled },
  );

  const isPending =
    !enabled || deals.isPending || contacts.isPending || tasks.isPending;

  const metrics = useMemo(() => {
    if (isPending) return undefined;
    const wonIndex = dealStages.findIndex((stage) => stage.value === "won");
    const pipelineStages =
      wonIndex >= 0
        ? dealStages.slice(0, wonIndex + 1).map((stage) => stage.value)
        : [];
    const visible =
      scopedSalesId != null
        ? salespeople.filter((person) => person.id === scopedSalesId)
        : salespeople;
    return computeDashboardMetrics({
      deals: deals.data ?? [],
      contacts: contacts.data ?? [],
      tasks: tasks.data ?? [],
      sales: visible.map((person) => ({
        id: person.id,
        first_name: person.name,
        last_name: "",
      })),
      pipelineStages,
      period,
    });
  }, [
    isPending,
    dealStages,
    deals.data,
    contacts.data,
    tasks.data,
    salespeople,
    scopedSalesId,
    period,
  ]);

  const truncated = [deals, contacts, tasks].some(
    (list) => list.total != null && list.total > (list.data?.length ?? 0),
  );

  return {
    isPending,
    isAdmin,
    salespeople,
    scopedSalesId,
    metrics,
    truncated,
  };
};
