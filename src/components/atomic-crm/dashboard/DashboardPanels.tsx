import { differenceInCalendarDays } from "date-fns";
import { useTranslate } from "ra-core";
import { Link } from "react-router";

import { findDealLabel } from "../deals/dealUtils";
import { StaggerItem, StaggerList } from "../misc/motion/Stagger";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { DashboardActivityLog } from "./DashboardActivityLog";
import {
  ChartEmpty,
  ColumnChart,
  DonutChart,
  LeadsAreaChart,
  WonLostChart,
} from "./DashboardCharts";
import {
  BarRows,
  DashboardCard,
  InitialsAvatar,
  type BarRow,
} from "./DashboardParts";
import type { DashboardMetrics } from "./dashboardMetrics";
import {
  getPeriodRanges,
  type BucketUnit,
  type DateRange,
  type PeriodId,
} from "./dashboardPeriods";
import { HotContacts } from "./HotContacts";
import { TasksList } from "./TasksList";
import { useDashboardFormat } from "./useDashboardFormat";

const GRID = "grid grid-cols-1 gap-4";
const TWO = `${GRID} md:grid-cols-2`;
const THREE = `${GRID} lg:grid-cols-3`;

interface PanelProps {
  metrics: DashboardMetrics;
  period: PeriodId;
}

const useBucketLabel = () => {
  const format = useDashboardFormat();
  return (range: DateRange, unit: BucketUnit) =>
    unit === "month"
      ? format.monthName(range.start)
      : format.shortDate(range.start);
};

const WonLostCard = ({ metrics, period }: PanelProps) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  const label = useBucketLabel();
  const { flowUnit } = getPeriodRanges(period).definition;
  const hasData = metrics.flow.some((bucket) => bucket.won || bucket.lost);

  return (
    <DashboardCard
      icon="trend"
      title={translate("crm.dashboard.charts.won_vs_lost")}
      hint={translate("crm.dashboard.charts.won_vs_lost_hint")}
    >
      {hasData ? (
        <>
          <WonLostChart
            data={metrics.flow.map((bucket) => ({
              label: label(bucket.range, flowUnit),
              won: bucket.won,
              lost: bucket.lost,
            }))}
            ariaLabel={translate("crm.dashboard.charts.won_vs_lost")}
            formatValue={format.compactMoney}
            wonLabel={translate("crm.dashboard.charts.won")}
            lostLabel={translate("crm.dashboard.charts.lost")}
          />
          <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
              {translate("crm.dashboard.charts.won")}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-rose-500 dark:bg-rose-400" />
              {translate("crm.dashboard.charts.lost")}
            </li>
          </ul>
        </>
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

const CategoryCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  const { dealCategories } = useConfigurationContext();
  const max = metrics.categories[0]?.amount ?? 0;
  const rows: BarRow[] = metrics.categories.slice(0, 8).map((entry) => ({
    key: entry.category,
    label:
      dealCategories.find((category) => category.value === entry.category)
        ?.label ?? entry.category,
    ratio: max ? entry.amount / max : 0,
    display: format.compactMoney(entry.amount),
  }));

  return (
    <DashboardCard
      icon="procedures"
      title={translate("crm.dashboard.charts.by_category")}
      hint={translate("crm.dashboard.charts.by_category_hint")}
    >
      {rows.length ? (
        <BarRows rows={rows} />
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

const LeadsCard = ({ metrics, period }: PanelProps) => {
  const translate = useTranslate();
  const label = useBucketLabel();
  const { leadsUnit } = getPeriodRanges(period).definition;
  const unit = translate("crm.dashboard.charts.contacts_unit");

  return (
    <DashboardCard
      icon="leads"
      title={translate(`crm.dashboard.charts.leads_by_${leadsUnit}`)}
      hint={translate("crm.dashboard.charts.leads_hint", {
        count: metrics.newContacts,
      })}
    >
      {metrics.newContacts ? (
        <LeadsAreaChart
          points={metrics.leads.map((bucket) => ({
            label: label(bucket.range, leadsUnit),
            value: bucket.value,
          }))}
          ariaLabel={translate(`crm.dashboard.charts.leads_by_${leadsUnit}`)}
          tooltipUnit={unit}
        />
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

const FunnelCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  const { dealStages } = useConfigurationContext();
  const top = metrics.funnel[0]?.value ?? 0;
  const rows: BarRow[] = metrics.funnel.map((step, index) => ({
    key: step.key,
    label:
      step.key === "contacts"
        ? translate("crm.dashboard.charts.funnel_contacts")
        : (findDealLabel(dealStages, step.key) ?? step.key),
    ratio: top ? step.value / top : 0,
    display: (
      <>
        {step.value}
        {index > 0 && top ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {format.percent((step.value / top) * 100, 0)}
          </span>
        ) : null}
      </>
    ),
  }));

  return (
    <DashboardCard
      icon="funnel"
      title={translate("crm.dashboard.charts.funnel")}
      hint={translate("crm.dashboard.charts.funnel_hint")}
    >
      {top || metrics.funnel.some((step) => step.value) ? (
        <BarRows rows={rows} />
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

const GrowthCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  const values = metrics.weeklyContacts;
  const last = values[values.length - 1] ?? 0;
  const before = values[values.length - 2] ?? 0;
  const change = before ? (last / before - 1) * 100 : null;

  return (
    <DashboardCard
      icon="trend"
      title={translate("crm.dashboard.charts.growth")}
      hint={translate("crm.dashboard.charts.growth_hint")}
    >
      <ColumnChart
        values={values}
        ariaLabel={translate("crm.dashboard.charts.growth")}
        tooltipUnit={translate("crm.dashboard.charts.contacts_unit")}
      />
      <p className="text-xs text-muted-foreground">
        {translate("crm.dashboard.charts.growth_this_week", {
          count: last,
          change:
            change == null
              ? "–"
              : `${change >= 0 ? "+" : ""}${format.percent(change, 0)}`,
        })}
      </p>
    </DashboardCard>
  );
};

const PortfolioCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  return (
    <DashboardCard
      icon="team"
      title={translate("crm.dashboard.charts.portfolio")}
    >
      {metrics.portfolio.length ? (
        <DonutChart
          slices={metrics.portfolio.map((entry) => ({
            label: entry.name || translate("crm.dashboard.charts.unassigned"),
            value: entry.contacts,
          }))}
          centerLabel={translate("crm.dashboard.charts.contacts_unit")}
          ariaLabel={translate("crm.dashboard.charts.portfolio")}
        />
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

const TeamResultsCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  const max = Math.max(1, ...metrics.team.map((p) => Math.max(p.won, p.lost)));
  const topWins = metrics.team.find((person) => person.won > 0);
  const topLosses = [...metrics.team].sort((a, b) => b.lost - a.lost)[0];

  return (
    <DashboardCard
      icon="ranking"
      title={translate("crm.dashboard.charts.team_results")}
      hint={translate("crm.dashboard.charts.team_results_hint")}
    >
      {topWins || (topLosses && topLosses.lost > 0) ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {topWins ? (
            <span className="rounded-full border px-2 py-0.5">
              {translate("crm.dashboard.charts.most_wins", {
                name: topWins.name,
                count: topWins.won,
              })}
            </span>
          ) : null}
          {topLosses && topLosses.lost > 0 ? (
            <span className="rounded-full border border-amber-500/50 px-2 py-0.5 text-amber-700 dark:text-amber-300">
              {translate("crm.dashboard.charts.most_losses", {
                name: topLosses.name,
                count: topLosses.lost,
              })}
            </span>
          ) : null}
        </div>
      ) : null}
      {metrics.team.length ? (
        <StaggerList className="flex flex-col divide-y">
          {metrics.team.map((person) => (
            <StaggerItem
              key={String(person.salesId)}
              className="py-2 first:pt-0"
            >
              <div className="flex justify-between gap-2 text-sm font-semibold">
                <span className="truncate">{person.name}</span>
                {person.winRate != null ? (
                  <span className="text-xs font-normal text-muted-foreground">
                    {translate("crm.dashboard.charts.win_rate", {
                      rate: format.number(person.winRate),
                    })}
                  </span>
                ) : null}
              </div>
              <BarRows
                rows={[
                  {
                    key: "won",
                    label: translate("crm.dashboard.charts.won"),
                    ratio: person.won / max,
                    display: person.won,
                    tone: "won",
                  },
                  {
                    key: "lost",
                    label: translate("crm.dashboard.charts.lost"),
                    ratio: person.lost / max,
                    display: person.lost,
                    tone: "lost",
                  },
                ]}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

const FollowUpCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  const rows: BarRow[] = metrics.followUp.map((person) => {
    const rate = person.onTimeRate;
    return {
      key: String(person.salesId),
      label: person.name,
      sub: translate("crm.dashboard.charts.overdue_count", {
        smart_count: person.overdue,
      }),
      ratio: rate != null ? rate / 100 : 0,
      display: rate != null ? format.percent(rate, 0) : "–",
      tone:
        rate == null
          ? "primary"
          : rate >= 85
            ? "won"
            : rate >= 70
              ? "warn"
              : "lost",
    };
  });

  return (
    <DashboardCard
      icon="followUp"
      title={translate("crm.dashboard.charts.follow_up")}
      hint={translate("crm.dashboard.charts.follow_up_hint")}
    >
      {rows.length ? (
        <BarRows rows={rows} />
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

const PersonRow = ({
  contactId,
  name,
  detail,
  value,
}: {
  contactId: string | number;
  name: string;
  detail: string;
  value: string;
}) => (
  <StaggerItem>
    <Link
      to={`/contacts/${contactId}/show`}
      className="flex items-center gap-3 py-2 hover:bg-muted/50 rounded-md"
    >
      <InitialsAvatar name={name} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {detail}
        </span>
      </span>
      <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
        {value}
      </span>
    </Link>
  </StaggerItem>
);

const DormantCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  const now = new Date();
  return (
    <DashboardCard
      icon="cooling"
      title={translate("crm.dashboard.charts.dormant")}
      hint={translate("crm.dashboard.charts.dormant_hint", {
        count: metrics.dormant.total,
        days: 45,
      })}
    >
      {metrics.dormant.items.length ? (
        <StaggerList className="flex flex-col divide-y">
          {metrics.dormant.items.map((item) => (
            <PersonRow
              key={String(item.contactId)}
              contactId={item.contactId}
              name={item.name}
              detail={translate("crm.dashboard.charts.dormant_last_seen")}
              value={translate("crm.dashboard.charts.dormant_days", {
                days: differenceInCalendarDays(now, new Date(item.lastSeen)),
              })}
            />
          ))}
        </StaggerList>
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.dormant_none")} />
      )}
    </DashboardCard>
  );
};

const TopClientsCard = ({ metrics }: PanelProps) => {
  const translate = useTranslate();
  const format = useDashboardFormat();
  return (
    <DashboardCard
      icon="ranking"
      title={translate("crm.dashboard.charts.top_clients")}
      hint={translate("crm.dashboard.charts.top_clients_hint")}
    >
      {metrics.topClients.length ? (
        <StaggerList className="flex flex-col divide-y">
          {metrics.topClients.map((client) => (
            <PersonRow
              key={String(client.contactId)}
              contactId={client.contactId}
              name={client.name}
              detail={translate("crm.dashboard.charts.purchases", {
                smart_count: client.purchases,
              })}
              value={format.money(client.amount)}
            />
          ))}
        </StaggerList>
      ) : (
        <ChartEmpty label={translate("crm.dashboard.charts.empty")} />
      )}
    </DashboardCard>
  );
};

export const SalesPanel = (props: PanelProps) => (
  <div className={TWO}>
    <WonLostCard {...props} />
    <CategoryCard {...props} />
  </div>
);

export const LeadsPanel = (props: PanelProps) => (
  <div className="flex flex-col gap-4">
    <div className={TWO}>
      <LeadsCard {...props} />
      <FunnelCard {...props} />
    </div>
    <div className={TWO}>
      <GrowthCard {...props} />
    </div>
  </div>
);

export const TeamPanel = (props: PanelProps) => (
  <div className={THREE}>
    <PortfolioCard {...props} />
    <TeamResultsCard {...props} />
    <FollowUpCard {...props} />
  </div>
);

export const ClientsPanel = (props: PanelProps) => (
  <div className={THREE}>
    <DormantCard {...props} />
    <TopClientsCard {...props} />
    <HotContacts />
  </div>
);

export const ActivityPanel = () => (
  <div className={TWO}>
    <DashboardActivityLog />
    <TasksList />
  </div>
);
