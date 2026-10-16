export type TourId = "dashboard" | "deals";

/** Bump when a tour changes enough that people should see it again. */
export const TOUR_VERSION = 2;

export interface TourStep {
  id: string;
  /** Element to highlight. Without one the step is a centred message. */
  selector?: string;
  titleKey: string;
  descriptionKey: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

/** Screens mark what a tour can point at with `data-tour="<name>"`. */
export const tourAnchor = (name: string) => `[data-tour="${name}"]`;

const textKey = (tour: TourId, step: string, part: string) =>
  `crm.onboarding.${tour}.${step}.${part}`;

const step = (
  tour: TourId,
  id: string,
  options: Omit<TourStep, "id" | "titleKey" | "descriptionKey"> & {
    descriptionPart?: string;
  } = {},
): TourStep => {
  const { descriptionPart = "description", ...rest } = options;
  return {
    id,
    titleKey: textKey(tour, id, "title"),
    descriptionKey: textKey(tour, id, descriptionPart),
    ...rest,
  };
};

export const getDashboardTourSteps = ({
  isAdmin,
}: {
  isAdmin: boolean;
}): TourStep[] => [
  step("dashboard", "welcome"),
  step("dashboard", "filters", {
    selector: tourAnchor("dashboard-filters"),
    side: "bottom",
    align: "end",
    descriptionPart: isAdmin ? "description_admin" : "description_member",
  }),
  step("dashboard", "kpis", {
    selector: tourAnchor("dashboard-kpis"),
    side: "bottom",
  }),
  step("dashboard", "tabs", {
    selector: tourAnchor("dashboard-tabs"),
    side: "bottom",
    align: "start",
  }),
  step("dashboard", "agenda", {
    selector: tourAnchor("dashboard-agenda"),
    side: "top",
  }),
  ...(isAdmin
    ? [
        step("dashboard", "team", {
          selector: tourAnchor("dashboard-tab-team"),
          side: "bottom",
        }),
      ]
    : []),
  step("dashboard", "calendar", {
    selector: tourAnchor("nav-calendar"),
    side: "bottom",
  }),
  step("dashboard", "tools", {
    selector: tourAnchor("header-tools"),
    side: "bottom",
    align: "end",
  }),
];

export const getDealsTourSteps = ({
  isEmpty,
}: {
  isEmpty: boolean;
}): TourStep[] =>
  isEmpty
    ? [
        step("deals", "empty_intro"),
        step("deals", "empty_create", {
          selector: tourAnchor("deal-empty-create"),
          side: "top",
        }),
      ]
    : [
        step("deals", "views", {
          selector: tourAnchor("deal-view-switcher"),
          side: "bottom",
          align: "start",
        }),
        step("deals", "board", {
          selector: tourAnchor("deal-column-header"),
          side: "bottom",
        }),
        step("deals", "card", {
          selector: tourAnchor("deal-card"),
          side: "right",
        }),
        step("deals", "cooling", {
          selector: tourAnchor("deal-cooling"),
          side: "right",
        }),
        step("deals", "sort", {
          selector: tourAnchor("deal-sort"),
          side: "bottom",
          align: "end",
        }),
        step("deals", "filters", {
          selector: tourAnchor("list-filters"),
          side: "bottom",
          align: "start",
        }),
        step("deals", "new", {
          selector: tourAnchor("deal-new"),
          side: "bottom",
          align: "end",
        }),
      ];
