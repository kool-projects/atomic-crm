import { useStore } from "ra-core";

export type DealView = "board" | "focus";

/** The saved choice of how deals are laid out. The board is the default. */
export const useDealView = () => {
  const [stored, setView] = useStore<DealView>("deals.view", "board");
  const view: DealView = stored === "focus" ? "focus" : "board";
  return [view, setView] as const;
};
