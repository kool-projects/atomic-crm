import { createContext, useContext } from "react";

import type { Deal } from "../types";

export interface DealInteractions {
  /** Most recent sign of life per deal. See getLastInteraction. */
  lastInteraction: Map<Deal["id"], Date | null>;
  /** Name of the first contact of each deal, when it is known. */
  clientNames: Map<Deal["id"], string>;
}

export const EMPTY_DEAL_INTERACTIONS: DealInteractions = {
  lastInteraction: new Map(),
  clientNames: new Map(),
};

export const DealInteractionsContext = createContext<DealInteractions>(
  EMPTY_DEAL_INTERACTIONS,
);

/** Outside a board (the archive, for instance) nothing is known: no age shown. */
export const useDealInteraction = (dealId: Deal["id"]) => {
  const { lastInteraction } = useContext(DealInteractionsContext);
  return lastInteraction.get(dealId) ?? null;
};
