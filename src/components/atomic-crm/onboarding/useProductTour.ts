import { useGetIdentity, useTranslate } from "ra-core";
import { useCallback, useEffect, useRef } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  START_TOUR_EVENT,
  hasSeenTour,
  markTourSeen,
  takePendingTour,
} from "./tourProgress";
import type { TourId, TourStep } from "./tourSteps";

const WAIT_FOR_ELEMENTS_MS = 4000;
const WAIT_FOR_STABLE_MS = 2000;
const POLL_MS = 100;
/** How long a position must stay put to count as settled. */
const STABLE_FOR_MS = 300;
const REFRESH_DEBOUNCE_MS = 120;

const waitForElements = async (selectors: string[]) => {
  const deadline = Date.now() + WAIT_FOR_ELEMENTS_MS;
  while (Date.now() < deadline) {
    if (selectors.every((selector) => document.querySelector(selector))) return;
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
};

/**
 * Cards fill in as their company and client names arrive, which moves
 * everything around. Wait until the first highlight stops moving, so the
 * tour does not point at where things used to be.
 */
const waitUntilStable = async (selector: string | undefined) => {
  if (!selector) return;
  const deadline = Date.now() + WAIT_FOR_STABLE_MS;
  let last = "";
  let stableSince = Date.now();
  while (Date.now() < deadline) {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    const current = rect
      ? [rect.x, rect.y, rect.width, rect.height].map(Math.round).join(",")
      : "";
    if (current !== last) {
      last = current;
      stableSince = Date.now();
    } else if (current && Date.now() - stableSince >= STABLE_FOR_MS) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
};

interface UseProductTourOptions {
  tourId: TourId;
  steps: TourStep[];
  /** The page has its data on screen, so the elements can be found. */
  ready: boolean;
}

/**
 * A guided tour of one page. It opens by itself the first time a person sees
 * the page, and again whenever "Guided tour" is picked in the profile menu.
 * Steps whose element is not on screen are skipped. Desktop only for now.
 */
export const useProductTour = ({
  tourId,
  steps,
  ready,
}: UseProductTourOptions) => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();
  const isMobile = useIsMobile();
  const userId = identity?.id;

  const latest = useRef({ steps, translate });
  useEffect(() => {
    latest.current = { steps, translate };
  });
  const activeTour = useRef<{ destroy: () => void } | null>(null);
  const stopWatchingLayout = useRef<(() => void) | null>(null);
  const isUnmounting = useRef(false);
  const isStarting = useRef(false);

  const start = useCallback(async () => {
    if (userId == null || isStarting.current) return;
    isStarting.current = true;
    try {
      const { steps: wanted, translate: t } = latest.current;
      await waitForElements(
        wanted.slice(0, 2).flatMap((s) => (s.selector ? [s.selector] : [])),
      );

      const available = wanted.filter(
        (s) => !s.selector || document.querySelector(s.selector),
      );
      if (!available.length) return;
      await waitUntilStable(available.find((s) => s.selector)?.selector);

      const [{ driver }] = await Promise.all([
        import("driver.js"),
        import("driver.js/dist/driver.css"),
      ]);

      activeTour.current?.destroy();
      const instance = driver({
        showProgress: true,
        progressText: t("crm.onboarding.progress", {
          current: "{{current}}",
          total: "{{total}}",
        }),
        nextBtnText: t("crm.onboarding.next"),
        prevBtnText: t("crm.onboarding.previous"),
        doneBtnText: t("crm.onboarding.done"),
        popoverClass: "crm-tour",
        smoothScroll: true,
        stagePadding: 6,
        stageRadius: 10,
        overlayOpacity: 0.55,
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        steps: available.map((s) => ({
          element: s.selector,
          popover: {
            title: t(s.titleKey),
            description: t(s.descriptionKey),
            side: s.side,
            align: s.align,
          },
        })),
        onPopoverRender: (popover) => {
          const skip = document.createElement("button");
          skip.type = "button";
          skip.className = "crm-tour-skip";
          skip.textContent = t("crm.onboarding.skip");
          skip.addEventListener("click", () => instance.destroy());
          popover.footerButtons.prepend(skip);
        },
        onDestroyed: () => {
          stopWatchingLayout.current?.();
          stopWatchingLayout.current = null;
          activeTour.current = null;
          // Leaving the page mid-tour is not the same as finishing or skipping.
          if (!isUnmounting.current) markTourSeen(tourId, userId);
        },
      });
      activeTour.current = instance;
      instance.drive();

      // Keep the highlight on its target when the page moves underneath it.
      let timer: ReturnType<typeof setTimeout> | undefined;
      const observer = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => instance.refresh(), REFRESH_DEBOUNCE_MS);
      });
      observer.observe(document.body);
      stopWatchingLayout.current = () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    } finally {
      isStarting.current = false;
    }
  }, [tourId, userId]);

  // First visit, or a tour asked for from the menu while another page was open.
  useEffect(() => {
    if (!ready || isMobile || userId == null) return;
    const requested = takePendingTour(tourId);
    if (requested || !hasSeenTour(tourId, userId)) {
      void start();
    }
  }, [ready, isMobile, userId, tourId, start]);

  // "Guided tour" picked while this page is already open.
  useEffect(() => {
    if (isMobile) return;
    const onRequest = (event: Event) => {
      if ((event as CustomEvent<TourId>).detail !== tourId) return;
      takePendingTour(tourId);
      void start();
    };
    window.addEventListener(START_TOUR_EVENT, onRequest);
    return () => window.removeEventListener(START_TOUR_EVENT, onRequest);
  }, [isMobile, tourId, start]);

  useEffect(() => {
    isUnmounting.current = false;
    return () => {
      isUnmounting.current = true;
      activeTour.current?.destroy();
    };
  }, []);
};
