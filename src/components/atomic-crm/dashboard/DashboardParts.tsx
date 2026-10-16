import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { crmIcons, type CrmIconName } from "../misc/crmIcons";
import { StaggerItem, StaggerList } from "../misc/motion/Stagger";

export const DashboardCard = ({
  title,
  icon,
  hint,
  children,
  className,
}: {
  title: string;
  icon?: CrmIconName;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) => {
  const Icon = icon ? crmIcons[icon] : null;
  return (
    <Card className={cn("gap-3 py-4 px-4 min-w-0", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          {Icon ? <Icon className="size-4 shrink-0 text-primary" /> : null}
          {title}
        </h3>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
    </Card>
  );
};

type Tone = "primary" | "won" | "lost" | "warn";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary",
  won: "bg-emerald-500 dark:bg-emerald-400",
  lost: "bg-rose-500 dark:bg-rose-400",
  warn: "bg-amber-500 dark:bg-amber-400",
};

export interface BarRow {
  key: string;
  label: string;
  /** Small second line under the label. */
  sub?: string;
  /** 0 to 1: share of the track that is filled. */
  ratio: number;
  display: ReactNode;
  tone?: Tone;
}

/**
 * Labelled horizontal bars. The number is always printed, never colour only.
 * Rows slide in one after the other and each bar grows from empty.
 */
export const BarRows = ({ rows }: { rows: BarRow[] }) => {
  const reduceMotion = useReducedMotion();
  return (
    <StaggerList className="flex flex-col gap-2">
      {rows.map((row) => (
        <StaggerItem
          key={row.key}
          className="grid grid-cols-[minmax(6rem,1.2fr)_3fr_auto] items-center gap-3 text-sm"
        >
          <span className="min-w-0" title={row.label}>
            <span className="block truncate">{row.label}</span>
            {row.sub ? (
              <span className="block truncate text-xs text-muted-foreground">
                {row.sub}
              </span>
            ) : null}
          </span>
          <span className="h-2.5 rounded-full bg-muted overflow-hidden">
            <m.span
              className={cn(
                "block h-full rounded-full",
                TONE_CLASSES[row.tone ?? "primary"],
              )}
              initial={reduceMotion ? false : { width: 0 }}
              animate={{
                width: `${Math.max(0, Math.min(1, row.ratio)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </span>
          <span className="font-semibold tabular-nums text-right min-w-[3.5em]">
            {row.display}
          </span>
        </StaggerItem>
      ))}
    </StaggerList>
  );
};

export const InitialsAvatar = ({ name }: { name: string }) => {
  const [first = "", second = ""] = name.split(" ");
  return (
    <span className="size-7 shrink-0 rounded-full bg-accent text-accent-foreground grid place-items-center text-[11px] font-semibold">
      {(first[0] ?? "") + (second[0] ?? "")}
    </span>
  );
};
