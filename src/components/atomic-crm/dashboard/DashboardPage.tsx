import * as m from "motion/react-m";
import { useStore, useTranslate } from "ra-core";
import { useState, type ComponentType, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TasksCalendar } from "../calendar/TasksCalendar";
import { crmIcons } from "../misc/crmIcons";
import { useProductTour } from "../onboarding/useProductTour";
import { getDashboardTourSteps } from "../onboarding/tourSteps";
import { DashboardFilters } from "./DashboardFilters";
import { DashboardKpis } from "./DashboardKpis";
import {
  ActivityPanel,
  ClientsPanel,
  LeadsPanel,
  SalesPanel,
  TeamPanel,
} from "./DashboardPanels";
import { DEFAULT_PERIOD, isPeriodId, type PeriodId } from "./dashboardPeriods";
import {
  ALL_SALES,
  DASHBOARD_FETCH_LIMIT,
  useDashboardData,
} from "./useDashboardData";

type TabId = "agenda" | "sales" | "leads" | "team" | "clients" | "activity";

const DashboardTab = ({
  value,
  active,
  Icon,
  label,
  tourId,
}: {
  value: TabId;
  active: boolean;
  Icon: ComponentType<{ className?: string }>;
  label: string;
  tourId?: string;
}) => (
  <TabsTrigger
    value={value}
    data-tour={tourId}
    className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent"
  >
    <Icon />
    {label}
    {active ? (
      <m.span
        layoutId="dashboard-tab-underline"
        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
      />
    ) : null}
  </TabsTrigger>
);

/** The content of a tab fades in and rises a few pixels when it appears. */
const TabPanel = ({
  children,
  tourId,
}: {
  children: ReactNode;
  tourId?: string;
}) => (
  <m.div
    data-tour={tourId}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    {children}
  </m.div>
);

/**
 * Dashboard body: filters, four headline numbers and one tab per subject.
 * Admins can look at everyone or at one salesperson. Anyone else only ever
 * sees their own figures.
 */
export const DashboardPage = () => {
  const translate = useTranslate();
  const [storedPeriod, setPeriod] = useStore<PeriodId>(
    "dashboard.period",
    DEFAULT_PERIOD,
  );
  const [salesId, setSalesId] = useStore<string>(
    "dashboard.salesId",
    ALL_SALES,
  );
  const [tab, setTab] = useState<TabId>("agenda");

  const period = isPeriodId(storedPeriod) ? storedPeriod : DEFAULT_PERIOD;
  const data = useDashboardData({ period, salesId });
  useProductTour({
    tourId: "dashboard",
    steps: getDashboardTourSteps({ isAdmin: data.isAdmin }),
    ready: Boolean(data.metrics),
  });

  // The team tab compares people: it makes no sense for a single person.
  const showTeam = data.isAdmin && data.scopedSalesId == null;
  const activeTab: TabId = tab === "team" && !showTeam ? "sales" : tab;

  return (
    <div className="flex flex-col gap-4 mt-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <crmIcons.dashboard className="size-6 text-primary" />
          {translate("crm.dashboard.title")}
        </h1>
        <DashboardFilters
          period={period}
          onPeriodChange={setPeriod}
          salesId={salesId}
          onSalesIdChange={setSalesId}
          salespeople={data.salespeople}
          canPickSalesperson={data.isAdmin}
        />
      </div>

      {data.truncated ? (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {translate("crm.dashboard.truncated", {
            count: DASHBOARD_FETCH_LIMIT,
          })}
        </p>
      ) : null}

      {!data.metrics ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <DashboardKpis metrics={data.metrics} />
          <Tabs
            value={activeTab}
            onValueChange={(value) => setTab(value as TabId)}
          >
            <TabsList
              data-tour="dashboard-tabs"
              className="w-full justify-start overflow-x-auto md:w-fit"
            >
              <DashboardTab
                value="agenda"
                active={activeTab === "agenda"}
                Icon={crmIcons.calendar}
                label={translate("crm.dashboard.tabs.agenda")}
              />
              <DashboardTab
                value="sales"
                active={activeTab === "sales"}
                Icon={crmIcons.sales}
                label={translate("crm.dashboard.tabs.sales")}
              />
              <DashboardTab
                value="leads"
                active={activeTab === "leads"}
                Icon={crmIcons.leads}
                label={translate("crm.dashboard.tabs.leads")}
              />
              {showTeam ? (
                <DashboardTab
                  value="team"
                  active={activeTab === "team"}
                  tourId="dashboard-tab-team"
                  Icon={crmIcons.team}
                  label={translate("crm.dashboard.tabs.team")}
                />
              ) : null}
              <DashboardTab
                value="clients"
                active={activeTab === "clients"}
                Icon={crmIcons.clients}
                label={translate("crm.dashboard.tabs.clients")}
              />
              <DashboardTab
                value="activity"
                active={activeTab === "activity"}
                Icon={crmIcons.activity}
                label={translate("crm.dashboard.tabs.activity")}
              />
            </TabsList>
            <TabsContent value="agenda">
              <TabPanel tourId="dashboard-agenda">
                <TasksCalendar salesId={salesId} variant="day" />
              </TabPanel>
            </TabsContent>
            <TabsContent value="sales">
              <TabPanel>
                <SalesPanel metrics={data.metrics} period={period} />
              </TabPanel>
            </TabsContent>
            <TabsContent value="leads">
              <TabPanel>
                <LeadsPanel metrics={data.metrics} period={period} />
              </TabPanel>
            </TabsContent>
            {showTeam ? (
              <TabsContent value="team">
                <TabPanel>
                  <TeamPanel metrics={data.metrics} period={period} />
                </TabPanel>
              </TabsContent>
            ) : null}
            <TabsContent value="clients">
              <TabPanel>
                <ClientsPanel metrics={data.metrics} period={period} />
              </TabPanel>
            </TabsContent>
            <TabsContent value="activity">
              <TabPanel>
                <ActivityPanel />
              </TabPanel>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
