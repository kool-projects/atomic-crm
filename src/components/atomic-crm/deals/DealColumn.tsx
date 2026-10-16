import { Droppable } from "@hello-pangea/dnd";
import { ArrowUpDown } from "lucide-react";
import { useLocale, useTranslate } from "ra-core";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { findDealLabel } from "./dealUtils";
import {
  DEAL_SORT_OPTIONS,
  DEFAULT_DEAL_SORT,
  isDealSortId,
  type DealSortId,
} from "./dealSorting";
import { DealCard } from "./DealCard";

export const DealColumn = ({
  stage,
  deals,
  sort,
  onSortChange,
}: {
  stage: string;
  deals: Deal[];
  sort: DealSortId;
  onSortChange: (sort: DealSortId) => void;
}) => {
  const translate = useTranslate();
  const locale = useLocale();
  const totalAmount = deals.reduce((sum, deal) => sum + (deal.amount ?? 0), 0);
  const { dealStages, currency } = useConfigurationContext();
  const isSorted = sort !== DEFAULT_DEAL_SORT;

  return (
    <div className="flex min-w-0 flex-col rounded-2xl bg-muted/40 p-2 pb-4">
      <div
        className="flex items-start justify-between gap-2 px-1 pb-2"
        data-tour="deal-column-header"
      >
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">
            {findDealLabel(dealStages, stage)}
          </h3>
          <p className="text-xs text-muted-foreground">
            {deals.length} ·{" "}
            {totalAmount.toLocaleString(locale, {
              notation: "compact",
              style: "currency",
              currency,
              currencyDisplay: "narrowSymbol",
              maximumFractionDigits: 1,
            })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              data-tour="deal-sort"
              aria-label={translate("resources.deals.sort.label")}
              title={translate("resources.deals.sort.label")}
              className={cn(
                "size-7 shrink-0 text-muted-foreground",
                isSorted && "bg-accent text-accent-foreground",
              )}
            >
              <ArrowUpDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {translate("resources.deals.sort.label")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) =>
                isDealSortId(value) && onSortChange(value)
              }
            >
              {DEAL_SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option} value={option}>
                  {translate(`resources.deals.sort.${option}`)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Droppable droppableId={stage}>
        {(droppableProvided, snapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={cn(
              "flex min-h-16 flex-col gap-2 rounded-xl",
              snapshot.isDraggingOver && "bg-muted",
            )}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
