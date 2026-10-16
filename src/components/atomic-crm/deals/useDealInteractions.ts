import { useGetList, useGetMany } from "ra-core";
import { useMemo } from "react";

import type { Contact, Deal, DealNote } from "../types";
import { getLastInteraction } from "./dealCooling";
import type { DealInteractions } from "./dealInteractionsContext";

/** Last interaction and client name of every deal, computed once per board. */
export const useDealInteractions = (deals: Deal[]): DealInteractions => {
  // One query for the whole board: the newest notes on any deal.
  const { data: notes } = useGetList<DealNote>("deal_notes", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "date", order: "DESC" },
  });

  const contactIds = useMemo(
    () => [
      ...new Set(
        deals.flatMap((deal) =>
          deal.contact_ids?.[0] != null ? [deal.contact_ids[0]] : [],
        ),
      ),
    ],
    [deals],
  );
  const { data: contacts } = useGetMany<Contact>(
    "contacts",
    { ids: contactIds },
    { enabled: contactIds.length > 0 },
  );

  return useMemo(() => {
    const latestNote = new Map<Deal["id"], string>();
    (notes ?? []).forEach((note) => {
      const current = latestNote.get(note.deal_id);
      if (!current || new Date(note.date) > new Date(current)) {
        latestNote.set(note.deal_id, note.date);
      }
    });
    const contactById = new Map(
      (contacts ?? []).map((contact) => [contact.id, contact]),
    );

    const lastInteraction = new Map<Deal["id"], Date | null>();
    const clientNames = new Map<Deal["id"], string>();
    deals.forEach((deal) => {
      const contact = contactById.get(deal.contact_ids?.[0]);
      lastInteraction.set(
        deal.id,
        getLastInteraction({
          deal,
          lastNoteDate: latestNote.get(deal.id),
          contactLastSeen: contact?.last_seen,
        }),
      );
      const name = contact
        ? `${contact.first_name} ${contact.last_name}`.trim()
        : "";
      if (name) clientNames.set(deal.id, name);
    });
    return { lastInteraction, clientNames };
  }, [deals, notes, contacts]);
};
