import { Draggable } from "@hello-pangea/dnd";
import { CalendarDays, User } from "lucide-react";
import {
  useLocale,
  useRedirect,
  useReference,
  useStore,
  useTranslate,
} from "ra-core";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useTags } from "../tags/useTags";
import type { Company, Contact, Deal, Sale } from "../types";
import { getCooling, isDealClosed } from "./dealCooling";
import { useDealInteraction } from "./dealInteractionsContext";

/** From this many days without contact the age turns a soft red. */
const URGENT_AFTER_DAYS = 7;
/** Below this the card shows no age at all: nothing to worry about. */
const QUIET_UNTIL_DAYS = 2;

export const DealCard = ({ deal, index }: { deal: Deal; index: number }) => {
  if (!deal) return null;

  return (
    <Draggable draggableId={String(deal.id)} index={index}>
      {(provided, snapshot) => (
        <DealCardContent provided={provided} snapshot={snapshot} deal={deal} />
      )}
    </Draggable>
  );
};

const fullName = (person?: { first_name?: string; last_name?: string }) =>
  [person?.first_name, person?.last_name].filter(Boolean).join(" ");

/** Days without contact, shown only once it starts to matter. */
const AgeChip = ({ deal }: { deal: Deal }) => {
  const translate = useTranslate();
  const locale = useLocale();
  const lastInteraction = useDealInteraction(deal.id);

  if (!lastInteraction || isDealClosed(deal)) return null;
  const { days } = getCooling(lastInteraction);
  if (days <= QUIET_UNTIL_DAYS) return null;

  const when = new Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(
    lastInteraction,
  );

  return (
    <span
      data-tour="deal-cooling"
      title={translate("resources.deals.card.age_title", { days, date: when })}
      className={cn(
        "shrink-0 rounded-full px-2 py-px text-xs tabular-nums",
        days >= URGENT_AFTER_DAYS
          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
          : "bg-muted text-muted-foreground",
      )}
    >
      {translate("resources.deals.card.age_short", { days })}
    </span>
  );
};

export const DealCardContent = ({
  provided,
  snapshot,
  deal,
}: {
  provided?: any;
  snapshot?: any;
  deal: Deal;
}) => {
  const redirect = useRedirect();
  const locale = useLocale();
  const [showDetails] = useStore<boolean>("deals.showDetails", false);
  const handleClick = () => {
    redirect(`/deals/${deal.id}/show`, undefined, undefined, undefined, {
      _scrollToTop: false,
    });
  };

  const contactIds = deal.contact_ids ?? [];
  const { referenceRecord: company } = useReference<Company>({
    reference: "companies",
    id: deal.company_id,
  });
  const { referenceRecord: contact } = useReference<Contact>({
    reference: "contacts",
    id: contactIds[0],
  });
  const { referenceRecord: sale } = useReference<Sale>({
    reference: "sales",
    id: deal.sales_id,
  });
  const { data: allTags } = useTags();

  const clientName = fullName(contact) || deal.name;
  const extraContacts = contactIds.length - 1;
  const tags = (contact?.tags ?? [])
    .map((tagId) => allTags?.find((tag) => tag.id === tagId))
    .filter((tag) => tag != null);
  const createdAt = deal.created_at
    ? new Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(
        new Date(deal.created_at),
      )
    : null;
  const hasDetails = Boolean(fullName(sale) || createdAt || tags.length);

  const details = (
    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
        {fullName(sale) ? (
          <span className="inline-flex items-center gap-1">
            <User className="size-3" />
            {fullName(sale)}
          </span>
        ) : null}
        {createdAt ? (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3" />
            {createdAt}
          </span>
        ) : null}
      </p>
      {tags.length ? (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="text-black font-normal border-0"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className="group relative cursor-pointer"
      data-tour="deal-card"
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      onClick={handleClick}
    >
      <Card
        className={cn(
          "gap-0 border border-transparent bg-card py-2.5 shadow-none transition-colors",
          "group-hover:border-border group-focus-visible:border-border",
          snapshot?.isDragging && "rotate-1 border-border opacity-90 shadow-lg",
        )}
      >
        <CardContent className="flex flex-col gap-0.5 px-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[15px] font-semibold leading-snug break-words">
              {clientName}
              {extraContacts > 0 ? (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  +{extraContacts}
                </span>
              ) : null}
            </p>
            <AgeChip deal={deal} />
          </div>
          {company?.name ? (
            <p className="text-xs text-muted-foreground break-words">
              {company.name}
            </p>
          ) : null}
          {hasDetails && showDetails ? (
            <div className="pt-1.5">{details}</div>
          ) : null}
        </CardContent>
      </Card>
      {hasDetails && !showDetails && !snapshot?.isDragging ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-full z-20 mt-1 hidden",
            "rounded-lg border bg-popover p-2.5 text-popover-foreground shadow-md",
            "group-hover:block group-focus-visible:block",
          )}
        >
          {details}
        </div>
      ) : null}
    </div>
  );
};
