import { TOUR_VERSION, type TourId } from "./tourSteps";

export const START_TOUR_EVENT = "crm:start-tour";
const PENDING_KEY = "crm-tour:pending";

/** One mark per tour, tour version and person, kept in this browser. */
export const tourSeenKey = (tourId: TourId, userId: string | number) =>
  `crm-tour:${tourId}:v${TOUR_VERSION}:${userId}`;

export const hasSeenTour = (tourId: TourId, userId: string | number) => {
  try {
    return window.localStorage.getItem(tourSeenKey(tourId, userId)) === "1";
  } catch {
    // Storage blocked: do not nag on every visit.
    return true;
  }
};

export const markTourSeen = (tourId: TourId, userId: string | number) => {
  try {
    window.localStorage.setItem(tourSeenKey(tourId, userId), "1");
  } catch {
    // Nothing to do: the tour simply is not remembered.
  }
};

/**
 * Ask for a tour to start. If the page is already open it starts at once,
 * otherwise it starts as soon as that page is ready.
 */
export const requestTour = (tourId: TourId) => {
  try {
    window.sessionStorage.setItem(PENDING_KEY, tourId);
  } catch {
    // The event below still reaches a page that is already open.
  }
  window.dispatchEvent(new CustomEvent(START_TOUR_EVENT, { detail: tourId }));
};

/** True once if this tour was requested, and forgets the request. */
export const takePendingTour = (tourId: TourId) => {
  try {
    if (window.sessionStorage.getItem(PENDING_KEY) !== tourId) return false;
    window.sessionStorage.removeItem(PENDING_KEY);
    return true;
  } catch {
    return false;
  }
};
