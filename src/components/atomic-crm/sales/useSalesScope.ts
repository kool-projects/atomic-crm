import { useCanAccess, useGetIdentity, useGetList } from "ra-core";
import { useMemo } from "react";

import type { Sale } from "../types";

export const ALL_SALES = "all";

export interface SalespersonOption {
  id: Sale["id"];
  name: string;
}

/**
 * Whose records a screen may show. Admins can look at everyone or pick one
 * salesperson. Anyone else is always limited to their own records.
 *
 * This shapes what the screen asks for. It is not an access rule: the backend
 * still answers to anyone who can sign in.
 */
export const useSalesScope = (selectedSalesId: string) => {
  const { identity, isPending: isIdentityPending } = useGetIdentity();
  const { canAccess, isPending: isAccessPending } = useCanAccess({
    resource: "sales",
    action: "list",
  });
  const isAdmin = canAccess === true;
  const isReady = !isIdentityPending && !isAccessPending && identity != null;

  const { data: salesList } = useGetList<Sale>(
    "sales",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "last_name", order: "ASC" },
      filter: { "disabled@neq": true },
    },
    { enabled: isReady && isAdmin },
  );

  const salespeople = useMemo<SalespersonOption[]>(() => {
    if (!isAdmin) {
      return identity
        ? [{ id: identity.id, name: identity.fullName ?? "" }]
        : [];
    }
    return (salesList ?? []).map((sale) => ({
      id: sale.id,
      name: `${sale.first_name} ${sale.last_name}`.trim(),
    }));
  }, [isAdmin, identity, salesList]);

  const scopedSalesId = !isAdmin
    ? identity?.id
    : salespeople.find((person) => String(person.id) === selectedSalesId)?.id;

  return {
    isAdmin,
    salespeople,
    scopedSalesId,
    /** True once identity, access rights and the salespeople list are known. */
    isLoaded: isReady && (!isAdmin || salesList != null),
  };
};
