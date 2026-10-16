import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";

const STROKE_BY_SERIES = [
  "stroke-chart-1",
  "stroke-chart-2",
  "stroke-chart-3",
  "stroke-chart-4",
  "stroke-chart-5",
];
const SWATCH_BY_SERIES = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

const AXIS_TEXT = "fill-muted-foreground text-[10px]";

export const ChartEmpty = ({ label }: { label: string }) => (
  <p className="text-sm text-muted-foreground py-8 text-center">{label}</p>
);

interface LeadsAreaChartProps {
  points: { label: string; value: number }[];
  ariaLabel: string;
  tooltipUnit: string;
}

/** New contacts over time, as an area with an emphasised last point. */
export const LeadsAreaChart = ({
  points,
  ariaLabel,
  tooltipUnit,
}: LeadsAreaChartProps) => {
  const reduceMotion = useReducedMotion();
  const W = 560;
  const H = 200;
  const L = 30;
  const R = 10;
  const T = 14;
  const B = 26;
  const innerWidth = W - L - R;
  const innerHeight = H - T - B;
  const count = points.length;
  if (!count) return null;

  const top = Math.max(
    2,
    Math.ceil(Math.max(...points.map((p) => p.value)) / 2) * 2,
  );
  const x = (index: number) =>
    count === 1 ? L + innerWidth / 2 : L + (innerWidth * index) / (count - 1);
  const y = (value: number) => T + innerHeight * (1 - value / top);
  const line = points
    .map(
      (p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${x(count - 1).toFixed(1)},${T + innerHeight} L${x(0).toFixed(1)},${T + innerHeight} Z`;
  // A new series redraws the line instead of morphing the old one.
  const signature = points.map((p) => p.value).join(",");
  const tickIndexes = [
    ...new Set([
      0,
      Math.floor(count / 4),
      Math.floor(count / 2),
      Math.floor((3 * count) / 4),
      count - 1,
    ]),
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      className="w-full h-auto"
    >
      {[0, top / 2, top].map((tick) => (
        <g key={tick}>
          <line
            x1={L}
            x2={W - R}
            y1={y(tick)}
            y2={y(tick)}
            className="stroke-border"
          />
          <text
            x={L - 6}
            y={y(tick) + 3}
            textAnchor="end"
            className={AXIS_TEXT}
          >
            {tick}
          </text>
        </g>
      ))}
      <m.path
        key={`area-${signature}`}
        d={area}
        className="fill-primary/20"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
      <m.path
        key={`line-${signature}`}
        d={line}
        className="fill-none stroke-primary stroke-2"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <m.circle
        key={`dot-${signature}`}
        cx={x(count - 1)}
        cy={y(points[count - 1].value)}
        r={4}
        className="fill-primary"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.9 }}
      />
      {tickIndexes.map((index) => (
        <text
          key={index}
          x={x(index)}
          y={H - 8}
          textAnchor={
            index === 0 ? "start" : index === count - 1 ? "end" : "middle"
          }
          className={AXIS_TEXT}
        >
          {points[index].label}
        </text>
      ))}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(p.value)}
          r={7}
          className="fill-transparent"
        >
          <title>{`${p.label} · ${p.value} ${tooltipUnit}`}</title>
        </circle>
      ))}
    </svg>
  );
};

interface WonLostChartProps {
  data: { label: string; won: number; lost: number }[];
  ariaLabel: string;
  formatValue: (value: number) => string;
  wonLabel: string;
  lostLabel: string;
}

/** Won sales above the zero line, lost sales below it, on one scale. */
export const WonLostChart = ({
  data,
  ariaLabel,
  formatValue,
  wonLabel,
  lostLabel,
}: WonLostChartProps) => {
  const reduceMotion = useReducedMotion();
  const W = 560;
  const H = 232;
  const L = 8;
  const R = 8;
  const T = 18;
  const B = 40;
  const innerWidth = W - L - R;
  const innerHeight = H - T - B;
  const maxWon = Math.max(0, ...data.map((d) => d.won));
  const maxLost = Math.max(0, ...data.map((d) => d.lost));
  const total = maxWon + maxLost;
  if (!data.length || total === 0) return null;

  const scale = innerHeight / total;
  const zero = T + maxWon * scale;
  const band = innerWidth / data.length;
  const barWidth = Math.min(band * 0.5, 36);
  const showValues = data.length <= 8;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      className="w-full h-auto"
    >
      <line
        x1={L}
        x2={W - R}
        y1={zero}
        y2={zero}
        className="stroke-muted-foreground/60"
      />
      {data.map((d, i) => {
        const cx = L + band * i + band / 2;
        const wonHeight = d.won * scale;
        const lostHeight = d.lost * scale;
        return (
          <g key={i}>
            <m.rect
              x={cx - barWidth / 2}
              width={barWidth}
              rx={3}
              className="fill-emerald-500 dark:fill-emerald-400"
              initial={reduceMotion ? false : { y: zero, height: 0 }}
              animate={{ y: zero - wonHeight, height: wonHeight }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
            >
              <title>{`${d.label} · ${wonLabel}: ${formatValue(d.won)}`}</title>
            </m.rect>
            <m.rect
              x={cx - barWidth / 2}
              y={zero}
              width={barWidth}
              rx={3}
              className="fill-rose-500 dark:fill-rose-400"
              initial={reduceMotion ? false : { height: 0 }}
              animate={{ height: lostHeight }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
            >
              <title>{`${d.label} · ${lostLabel}: ${formatValue(d.lost)}`}</title>
            </m.rect>
            {showValues && d.won > 0 && (
              <m.text
                x={cx}
                y={zero - wonHeight - 5}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-semibold"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.4 + i * 0.04 }}
              >
                {formatValue(d.won)}
              </m.text>
            )}
            {showValues && d.lost > 0 && (
              <m.text
                x={cx}
                y={zero + lostHeight + 12}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-semibold"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.4 + i * 0.04 }}
              >
                {formatValue(d.lost)}
              </m.text>
            )}
            <text x={cx} y={H - 10} textAnchor="middle" className={AXIS_TEXT}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

interface DonutChartProps {
  slices: { label: string; value: number }[];
  centerLabel: string;
  ariaLabel: string;
}

export const DonutChart = ({
  slices,
  centerLabel,
  ariaLabel,
}: DonutChartProps) => {
  const reduceMotion = useReducedMotion();
  const size = 170;
  const center = size / 2;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (!total) return null;

  let offset = 0;
  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
        className="w-full h-auto max-w-[150px] mx-auto"
      >
        {slices.map((slice, i) => {
          const length = (circumference * slice.value) / total;
          const circle = (
            <m.circle
              key={slice.label + i}
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={24}
              fill="none"
              className={STROKE_BY_SERIES[i % STROKE_BY_SERIES.length]}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${center} ${center})`}
              initial={
                reduceMotion ? false : { strokeDasharray: `0 ${circumference}` }
              }
              animate={{
                strokeDasharray: `${Math.max(length - 2, 0)} ${circumference - length + 2}`,
              }}
              transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
            >
              <title>{`${slice.label} · ${slice.value}`}</title>
            </m.circle>
          );
          offset += length;
          return circle;
        })}
        <text
          x={center}
          y={center + 4}
          textAnchor="middle"
          className="fill-foreground text-2xl font-semibold"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 20}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          {centerLabel}
        </text>
      </svg>
      <ul className="flex flex-col gap-1 text-xs">
        {slices.map((slice, i) => (
          <li key={slice.label + i} className="flex items-center gap-2">
            <span
              className={cn(
                "size-2.5 rounded-sm shrink-0",
                SWATCH_BY_SERIES[i % SWATCH_BY_SERIES.length],
              )}
            />
            <span className="flex-1 truncate">{slice.label}</span>
            <span className="font-semibold tabular-nums">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ColumnChart = ({
  values,
  ariaLabel,
  tooltipUnit,
}: {
  values: number[];
  ariaLabel: string;
  tooltipUnit: string;
}) => {
  const reduceMotion = useReducedMotion();
  const W = 320;
  const H = 110;
  const max = Math.max(1, ...values);
  const band = W / Math.max(values.length, 1);
  const barWidth = band * 0.62;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      className="w-full h-auto"
    >
      {values.map((value, i) => {
        const height = ((H - 20) * value) / max;
        const x = band * i + (band - barWidth) / 2;
        const isLast = i === values.length - 1;
        return (
          <g key={i}>
            <m.rect
              x={x}
              width={barWidth}
              rx={3}
              className={isLast ? "fill-primary" : "fill-muted-foreground/30"}
              initial={reduceMotion ? false : { y: H - 4, height: 0 }}
              animate={{ y: H - 4 - height, height }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
            >
              <title>{`${value} ${tooltipUnit}`}</title>
            </m.rect>
            <text
              x={x + barWidth / 2}
              y={H - 8 - height}
              textAnchor="middle"
              className="fill-foreground text-[10px] font-semibold"
            >
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
