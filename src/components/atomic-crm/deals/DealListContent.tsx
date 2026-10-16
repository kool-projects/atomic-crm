import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import isEqual from "lodash/isEqual";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useDataProvider,
  useListContext,
  useStore,
  useTranslate,
  type DataProvider,
} from "ra-core";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { DealInteractionsContext } from "./dealInteractionsContext";
import { useDealInteractions } from "./useDealInteractions";
import {
  DEFAULT_DEAL_SORT,
  isDealSortId,
  sortDeals,
  type DealSortId,
} from "./dealSorting";
import { DealColumn } from "./DealColumn";
import type { DealsByStage } from "./stages";
import { getDealsByStage } from "./stages";

const EDGE_TOLERANCE_PX = 4;
/** The board shows three columns and half of the fourth. */
const VISIBLE_COLUMNS = 3.5;

/**
 * Columns in a row that scrolls sideways. The next column peeks in, half
 * visible and fading out, and a button says there is more to the side.
 */
const DealBoardScroller = ({ children }: { children: ReactNode }) => {
  const translate = useTranslate();
  const scroller = useRef<HTMLDivElement>(null);
  const grab = useRef<{ x: number; left: number } | null>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    setEdges({
      atStart: element.scrollLeft <= EDGE_TOLERANCE_PX,
      atEnd:
        element.scrollLeft + element.clientWidth >=
        element.scrollWidth - EDGE_TOLERANCE_PX,
    });
  }, []);

  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    updateEdges();
    element.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [updateEdges]);

  const scrollByColumns = (direction: 1 | -1) => {
    const element = scroller.current;
    if (!element) return;
    element.scrollBy({
      left: (direction * element.clientWidth) / VISIBLE_COLUMNS,
      behavior: "smooth",
    });
  };

  // Drag the empty space to scroll sideways. Cards keep their own drag.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const element = scroller.current;
    if (
      !element ||
      // Menus open in a portal, but their events still bubble up through here.
      !element.contains(target) ||
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      target.closest('[data-tour="deal-card"], button, a, input')
    ) {
      return;
    }
    grab.current = { x: event.clientX, left: element.scrollLeft };
    element.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = scroller.current;
    if (!grab.current || !element) return;
    element.scrollLeft = grab.current.left - (event.clientX - grab.current.x);
  };
  const onPointerUp = () => {
    grab.current = null;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-8 items-center justify-end gap-1">
        {!edges.atStart ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollByColumns(-1)}
            aria-label={translate("resources.deals.board.previous_stages")}
          >
            <ChevronLeft className="size-4" />
            {translate("resources.deals.board.previous_stages")}
          </Button>
        ) : null}
        {!edges.atEnd ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollByColumns(1)}
            aria-label={translate("resources.deals.board.more_stages")}
          >
            {translate("resources.deals.board.more_stages")}
            <ChevronRight className="size-4" />
          </Button>
        ) : null}
      </div>
      <div className="relative">
        <div
          ref={scroller}
          data-tour="deal-board"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="grid grid-flow-col auto-cols-[calc((100%-3rem)/3.5)] max-md:auto-cols-[85%] gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
        >
          {children}
        </div>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent transition-opacity",
            edges.atStart && "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent transition-opacity",
            edges.atEnd && "opacity-0",
          )}
        />
      </div>
    </div>
  );
};

export const DealListContent = () => {
  const { dealStages } = useConfigurationContext();
  const { data: unorderedDeals, isPending, refetch } = useListContext<Deal>();
  const dataProvider = useDataProvider();
  const [columnSort, setColumnSort] = useStore<Record<string, DealSortId>>(
    "deals.columnSort",
    {},
  );
  const interactions = useDealInteractions(unorderedDeals ?? []);

  // The order people set by dragging. Each column may be shown in another one.
  const [dealsByStage, setDealsByStage] = useState<DealsByStage>(
    getDealsByStage([], dealStages),
  );

  useEffect(() => {
    if (unorderedDeals) {
      const newDealsByStage = getDealsByStage(unorderedDeals, dealStages);
      if (!isEqual(newDealsByStage, dealsByStage)) {
        setDealsByStage(newDealsByStage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unorderedDeals]);

  const sortOf = useCallback(
    (stage: string): DealSortId => {
      const stored = columnSort[stage];
      return isDealSortId(stored) ? stored : DEFAULT_DEAL_SORT;
    },
    [columnSort],
  );

  const shownByStage = useMemo(
    () =>
      Object.fromEntries(
        dealStages.map((stage) => [
          stage.value,
          sortDeals(
            dealsByStage[stage.value] ?? [],
            sortOf(stage.value),
            interactions,
          ),
        ]),
      ) as DealsByStage,
    [dealStages, dealsByStage, sortOf, interactions],
  );

  if (isPending) return null;

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const sourceStage = source.droppableId;
    const destinationStage = destination.droppableId;
    const destinationIsManual = sortOf(destinationStage) === DEFAULT_DEAL_SORT;

    // A column shown in a sorted order has no order of its own to change.
    if (sourceStage === destinationStage && !destinationIsManual) {
      return;
    }
    if (
      destinationStage === sourceStage &&
      destination.index === source.index
    ) {
      return;
    }

    // Positions on screen follow the sorted view, the stored order does not.
    const sourceDeal = shownByStage[sourceStage][source.index];
    if (!sourceDeal) return;
    const sourceManualIndex = dealsByStage[sourceStage].findIndex(
      (deal) => deal.id === sourceDeal.id,
    );
    if (sourceManualIndex < 0) return;

    // Dropped in a sorted column: the card goes to the end of the stored order.
    const destinationManualIndex = destinationIsManual
      ? destination.index
      : undefined;
    const destinationDeal = (destinationIsManual
      ? dealsByStage[destinationStage][destination.index]
      : undefined) ?? {
      stage: destinationStage,
      index: undefined, // undefined if dropped after the last item
    };

    // compute local state change synchronously
    setDealsByStage(
      updateDealStageLocal(
        sourceDeal,
        { stage: sourceStage, index: sourceManualIndex },
        { stage: destinationStage, index: destinationManualIndex },
        dealsByStage,
      ),
    );

    // persist the changes
    updateDealStage(sourceDeal, destinationDeal, dataProvider).then(() => {
      refetch();
    });
  };

  return (
    <DealInteractionsContext.Provider value={interactions}>
      <DragDropContext onDragEnd={onDragEnd}>
        <DealBoardScroller>
          {dealStages.map((stage) => (
            <DealColumn
              stage={stage.value}
              deals={shownByStage[stage.value]}
              sort={sortOf(stage.value)}
              onSortChange={(sort) =>
                setColumnSort({ ...columnSort, [stage.value]: sort })
              }
              key={stage.value}
            />
          ))}
        </DealBoardScroller>
      </DragDropContext>
    </DealInteractionsContext.Provider>
  );
};

const updateDealStageLocal = (
  sourceDeal: Deal,
  source: { stage: string; index: number },
  destination: {
    stage: string;
    index?: number; // undefined if dropped after the last item
  },
  dealsByStage: DealsByStage,
) => {
  if (source.stage === destination.stage) {
    // moving deal inside the same column
    const column = dealsByStage[source.stage];
    column.splice(source.index, 1);
    column.splice(destination.index ?? column.length + 1, 0, sourceDeal);
    return {
      ...dealsByStage,
      [destination.stage]: column,
    };
  } else {
    // moving deal across columns
    const sourceColumn = dealsByStage[source.stage];
    const destinationColumn = dealsByStage[destination.stage];
    sourceColumn.splice(source.index, 1);
    destinationColumn.splice(
      destination.index ?? destinationColumn.length + 1,
      0,
      sourceDeal,
    );
    return {
      ...dealsByStage,
      [source.stage]: sourceColumn,
      [destination.stage]: destinationColumn,
    };
  }
};

const updateDealStage = async (
  source: Deal,
  destination: {
    stage: string;
    index?: number; // undefined if dropped after the last item
  },
  dataProvider: DataProvider,
) => {
  if (source.stage === destination.stage) {
    // moving deal inside the same column
    // Fetch all the deals in this stage (because the list may be filtered, but we need to update even non-filtered deals)
    const { data: columnDeals } = await dataProvider.getList("deals", {
      sort: { field: "index", order: "ASC" },
      pagination: { page: 1, perPage: 100 },
      filter: { stage: source.stage },
    });
    const destinationIndex = destination.index ?? columnDeals.length + 1;

    if (source.index > destinationIndex) {
      // deal moved up, eg
      // dest   src
      //  <------
      // [4, 7, 23, 5]
      await Promise.all([
        // for all deals between destinationIndex and source.index, increase the index
        ...columnDeals
          .filter(
            (deal) =>
              deal.index >= destinationIndex && deal.index < source.index,
          )
          .map((deal) =>
            dataProvider.update("deals", {
              id: deal.id,
              data: { index: deal.index + 1 },
              previousData: deal,
            }),
          ),
        // for the deal that was moved, update its index
        dataProvider.update("deals", {
          id: source.id,
          data: { index: destinationIndex },
          previousData: source,
        }),
      ]);
    } else {
      // deal moved down, e.g
      // src   dest
      //  ------>
      // [4, 7, 23, 5]
      await Promise.all([
        // for all deals between source.index and destinationIndex, decrease the index
        ...columnDeals
          .filter(
            (deal) =>
              deal.index <= destinationIndex && deal.index > source.index,
          )
          .map((deal) =>
            dataProvider.update("deals", {
              id: deal.id,
              data: { index: deal.index - 1 },
              previousData: deal,
            }),
          ),
        // for the deal that was moved, update its index
        dataProvider.update("deals", {
          id: source.id,
          data: { index: destinationIndex },
          previousData: source,
        }),
      ]);
    }
  } else {
    // moving deal across columns
    // Fetch all the deals in both stages (because the list may be filtered, but we need to update even non-filtered deals)
    const [{ data: sourceDeals }, { data: destinationDeals }] =
      await Promise.all([
        dataProvider.getList("deals", {
          sort: { field: "index", order: "ASC" },
          pagination: { page: 1, perPage: 100 },
          filter: { stage: source.stage },
        }),
        dataProvider.getList("deals", {
          sort: { field: "index", order: "ASC" },
          pagination: { page: 1, perPage: 100 },
          filter: { stage: destination.stage },
        }),
      ]);
    const destinationIndex = destination.index ?? destinationDeals.length + 1;

    await Promise.all([
      // decrease index on the deals after the source index in the source columns
      ...sourceDeals
        .filter((deal) => deal.index > source.index)
        .map((deal) =>
          dataProvider.update("deals", {
            id: deal.id,
            data: { index: deal.index - 1 },
            previousData: deal,
          }),
        ),
      // increase index on the deals after the destination index in the destination columns
      ...destinationDeals
        .filter((deal) => deal.index >= destinationIndex)
        .map((deal) =>
          dataProvider.update("deals", {
            id: deal.id,
            data: { index: deal.index + 1 },
            previousData: deal,
          }),
        ),
      // change the dragged deal to take the destination index and column.
      // Changing stage counts as an interaction: the card stops "cooling".
      dataProvider.update("deals", {
        id: source.id,
        data: {
          index: destinationIndex,
          stage: destination.stage,
          updated_at: new Date().toISOString(),
        },
        previousData: source,
      }),
    ]);
  }
};
