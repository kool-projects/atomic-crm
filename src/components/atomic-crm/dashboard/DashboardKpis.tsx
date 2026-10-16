import { useTranslate } from "ra-core";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { crmIcons, type CrmIconName } from "../misc/crmIcons";
import { AnimatedNumber } from "../misc/motion/AnimatedNumber";
import type { DashboardMetrics } from "./dashboardMetrics";
import { useDashboardFormat } from "./useDashboardFormat";

const Tile = ({
  icon,
  label,
  value,
  delta,
  deltaTone,
  hint,
}: {
  icon: CrmIconName;
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: "up" | "down" | "warn";
  hint: string;
}) => {
  const Icon = crmIcons[icon];
  return (
    <Card className="gap-1 px-4 py-3 min-w-0">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5 shrink-0 text-primary" />
        {label}
      </span>
      <span className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      {delta ? (
        <span
          className={cn(
            "text-xs",
            deltaTone === "up" && "text-emerald-600 dark:text-emerald-400",
            deltaTone === "down" && "text-rose-600 dark:text-rose-400",
            deltaTone === "warn" && "text-amber-600 dark:text-amber-400",
          )}
        >
          {delta}
        </span>
      ) : null}
      <span className="text-xs text-muted-foreground">{hint}</span>
    </Card>
  );
};

const signed = (formatted: string, value: number) =>
  `${value > 0 ? "▲ +" : value < 0 ? "▼ " : ""}${formatted}`;

export const DashboardKpis = ({ metrics }: { metrics: DashboardMetrics }) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  const vsPrevious = translate("crm.dashboard.kpi.vs_previous");
  const none = translate("crm.dashboard.kpi.no_data");

  const percentChange = (current: number | null, previous: number | null) => {
    if (current == null || previous == null || previous === 0) return undefined;
    const change = (current / previous - 1) * 100;
    return {
      text: `${signed(format.percent(change), change)} ${vsPrevious}`,
      tone: change >= 0 ? ("up" as const) : ("down" as const),
    };
  };

  const conversionDelta =
    metrics.conversion.value != null && metrics.conversion.previous != null
      ? metrics.conversion.value - metrics.conversion.previous
      : undefined;
  const ticket = percentChange(
    metrics.averageTicket.value,
    metrics.averageTicket.previous,
  );
  const won = percentChange(
    metrics.wonAmount.value,
    metrics.wonAmount.previous,
  );

  return (
    <div
      data-tour="dashboard-kpis"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
    >
      <Tile
        icon="conversion"
        label={translate("crm.dashboard.kpi.conversion")}
        value={
          metrics.conversion.value != null ? (
            <AnimatedNumber
              value={metrics.conversion.value}
              format={(n) => format.percent(n)}
            />
          ) : (
            none
          )
        }
        delta={
          conversionDelta != null
            ? `${signed(format.number(conversionDelta, 1), conversionDelta)} ${translate("crm.dashboard.kpi.points")} ${vsPrevious}`
            : undefined
        }
        deltaTone={
          conversionDelta != null && conversionDelta < 0 ? "down" : "up"
        }
        hint={translate("crm.dashboard.kpi.conversion_hint", {
          won: metrics.wonCount,
          leads: metrics.newContacts,
        })}
      />
      <Tile
        icon="ticket"
        label={translate("crm.dashboard.kpi.average_ticket")}
        value={
          metrics.averageTicket.value != null ? (
            <AnimatedNumber
              value={metrics.averageTicket.value}
              format={format.money}
            />
          ) : (
            none
          )
        }
        delta={ticket?.text}
        deltaTone={ticket?.tone}
        hint={translate("crm.dashboard.kpi.average_ticket_hint")}
      />
      <Tile
        icon="sales"
        label={translate("crm.dashboard.kpi.won_amount")}
        value={
          <AnimatedNumber
            value={metrics.wonAmount.value}
            format={format.money}
          />
        }
        delta={won?.text}
        deltaTone={won?.tone}
        hint={translate("crm.dashboard.kpi.won_amount_hint", {
          count: metrics.wonCount,
        })}
      />
      <Tile
        icon="overdue"
        label={translate("crm.dashboard.kpi.overdue_tasks")}
        value={
          <AnimatedNumber
            value={metrics.overdueTasks}
            format={(n) => format.number(n)}
          />
        }
        deltaTone="warn"
        hint={translate("crm.dashboard.kpi.overdue_tasks_hint")}
      />
    </div>
  );
};
