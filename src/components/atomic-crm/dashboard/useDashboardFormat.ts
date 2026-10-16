import { useLocale } from "ra-core";
import { useMemo } from "react";

import { useConfigurationContext } from "../root/ConfigurationContext";

/** Number and date formatting that follows the app language and currency. */
export const useDashboardFormat = () => {
  const locale = useLocale();
  const { currency } = useConfigurationContext();

  return useMemo(() => {
    const money = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    const compactMoney = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    });
    const shortDate = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
    });
    // The year keeps "Oct" and "Oct" apart in a 12-month view.
    const monthName = new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "2-digit",
    });
    const decimal = (digits: number) =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });

    return {
      money: (value: number) => money.format(value),
      compactMoney: (value: number) => compactMoney.format(value),
      percent: (value: number, digits = 1) =>
        `${decimal(digits).format(value)}%`,
      number: (value: number, digits = 0) => decimal(digits).format(value),
      shortDate: (date: Date) => shortDate.format(date),
      monthName: (date: Date) => monthName.format(date),
    };
  }, [locale, currency]);
};
