import { Check } from "lucide-react";
import {
  useListContext,
  useNotify,
  useRedirect,
  useReference,
  useTranslate,
  useUpdate,
  type Identifier,
} from "ra-core";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Company, Deal, Sale } from "../types";
import { getCooling, isDealClosed } from "./dealCooling";
import { useDealInteractions } from "./useDealInteractions";
import { findDealLabel } from "./dealUtils";

/** How many deals "Start here" asks for. Few on purpose. */
const FOCUS_SIZE = 3;
const URGENT_AFTER_DAYS = 7;
/** Parked deals do not ask for action today. */
const PARKED_STAGE = "delayed";

const fullName = (person?: { first_name?: string; last_name?: string }) =>
  [person?.first_name, person?.last_name].filter(Boolean).join(" ");

const FocusItem = ({
  deal,
  clientName,
  days,
  done,
  onDone,
}: {
  deal: Deal;
  clientName: string;
  days: number | null;
  done: boolean;
  onDone: () => void;
}) => {
  const translate = useTranslate();
  const redirect = useRedirect();
  const { referenceRecord: company } = useReference<Company>({
    reference: "companies",
    id: deal.company_id,
  });
  const { referenceRecord: sale } = useReference<Sale>({
    reference: "sales",
    id: deal.sales_id,
  });
  const detail = [company?.name, fullName(sale)].filter(Boolean).join(" · ");

  return (
    <li
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 transition-opacity",
        done && "opacity-50",
      )}
    >
      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={() =>
          redirect(`/deals/${deal.id}/show`, undefined, undefined, undefined, {
            _scrollToTop: false,
          })
        }
      >
        <span
          className={cn(
            "block truncate text-base font-semibold",
            done && "line-through",
          )}
        >
          {clientName}
        </span>
        {detail ? (
          <span className="block truncate text-sm text-muted-foreground">
            {detail}
          </span>
        ) : null}
      </button>
      {days != null ? (
        <span
          className={cn(
            "text-sm tabular-nums",
            days >= URGENT_AFTER_DAYS
              ? "text-rose-700 dark:text-rose-300"
              : "text-muted-foreground",
          )}
        >
          {translate("resources.deals.focus.days_without_contact", { days })}
        </span>
      ) : null}
      <Button
        variant={done ? "outline" : "default"}
        size="sm"
        disabled={done}
        onClick={onDone}
      >
        {done ? <Check className="size-4" /> : null}
        {translate(
          done ? "resources.deals.focus.done" : "resources.deals.focus.talked",
        )}
      </Button>
    </li>
  );
};

/**
 * The calm way to open the deals: a few that ask for you today, then the rest
 * as plain names. "I've talked to them" counts as an interaction.
 */
export const DealFocusView = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const { dealStages } = useConfigurationContext();
  const { data, isPending } = useListContext<Deal>();
  const deals = useMemo(() => data ?? [], [data]);
  const interactions = useDealInteractions(deals);
  const [update] = useUpdate();

  const [pinned, setPinned] = useState<Identifier[] | null>(null);
  const [doneIds, setDoneIds] = useState<Set<Identifier>>(new Set());

  const open = useMemo(
    () =>
      deals.filter(
        (deal) => !isDealClosed(deal) && deal.stage !== PARKED_STAGE,
      ),
    [deals],
  );

  const ranked = useMemo(
    () =>
      [...open].sort((a, b) => {
        const left = interactions.lastInteraction.get(a.id)?.getTime();
        const right = interactions.lastInteraction.get(b.id)?.getTime();
        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;
        return left - right;
      }),
    [open, interactions],
  );

  const nameOf = (deal: Deal) =>
    interactions.clientNames.get(deal.id) ?? deal.name;
  const daysOf = (deal: Deal) => {
    const last = interactions.lastInteraction.get(deal.id);
    return last ? getCooling(last).days : null;
  };

  if (isPending) return null;

  // The three stay put while they are being checked off.
  const focusIds = pinned ?? ranked.slice(0, FOCUS_SIZE).map((d) => d.id);
  const focus = focusIds
    .map((id) => deals.find((deal) => deal.id === id))
    .filter((deal): deal is Deal => deal != null);
  const doneCount = focus.filter((deal) => doneIds.has(deal.id)).length;
  const allDone = focus.length > 0 && doneCount === focus.length;

  const markContacted = (deal: Deal) => {
    setPinned(focusIds);
    setDoneIds(new Set([...doneIds, deal.id]));
    update(
      "deals",
      {
        id: deal.id,
        data: { updated_at: new Date().toISOString() },
        previousData: deal,
      },
      {
        mutationMode: "undoable",
        onSuccess: () =>
          notify("resources.deals.focus.marked", { undoable: true }),
      },
    );
  };

  const showNext = () => {
    setPinned(null);
    setDoneIds(new Set());
  };

  const openStages = dealStages.filter(
    (stage) =>
      stage.value !== "won" &&
      stage.value !== "lost" &&
      stage.value !== PARKED_STAGE,
  );
  const otherStages = dealStages.filter((stage) => !openStages.includes(stage));

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3" aria-label="focus">
        <div>
          <h2 className="text-lg font-semibold">
            {translate("resources.deals.focus.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {focus.length
              ? translate("resources.deals.focus.progress", {
                  done: doneCount,
                  total: focus.length,
                })
              : translate("resources.deals.focus.empty")}
          </p>
        </div>
        {focus.length ? (
          <ul className="flex flex-col gap-2">
            {focus.map((deal) => (
              <FocusItem
                key={deal.id}
                deal={deal}
                clientName={nameOf(deal)}
                days={daysOf(deal)}
                done={doneIds.has(deal.id)}
                onDone={() => markContacted(deal)}
              />
            ))}
          </ul>
        ) : null}
        {allDone ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {translate("resources.deals.focus.all_done")}
            </p>
            <Button variant="outline" size="sm" onClick={showNext}>
              {translate("resources.deals.focus.next")}
            </Button>
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">
          {translate("resources.deals.focus.all_title")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {openStages.map((stage) => {
            const list = deals.filter((deal) => deal.stage === stage.value);
            return (
              <div key={stage.value}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {findDealLabel(dealStages, stage.value)} · {list.length}
                </h3>
                <ul className="flex flex-col">
                  {list.map((deal) => (
                    <li key={deal.id} className="border-b last:border-b-0">
                      <button
                        type="button"
                        className="w-full py-2 text-left text-sm hover:text-primary"
                        onClick={() =>
                          redirect(
                            `/deals/${deal.id}/show`,
                            undefined,
                            undefined,
                            undefined,
                            { _scrollToTop: false },
                          )
                        }
                      >
                        {nameOf(deal)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground">
          {translate("resources.deals.focus.closed_summary")}{" "}
          {otherStages
            .map(
              (stage) =>
                `${findDealLabel(dealStages, stage.value)} ${
                  deals.filter((deal) => deal.stage === stage.value).length
                }`,
            )
            .join(" · ")}
        </p>
      </section>
    </div>
  );
};
