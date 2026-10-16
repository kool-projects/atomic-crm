import { animate, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef } from "react";

const DURATION_SECONDS = 0.7;

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
}

/**
 * Counts up to `value`: from zero on first display, then from the previous
 * value whenever `value` changes. The text is written straight to the DOM so
 * the count does not re-render React on every frame.
 */
export const AnimatedNumber = ({ value, format }: AnimatedNumberProps) => {
  const reduceMotion = useReducedMotion();
  const element = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const latestFormat = useRef(format);

  useLayoutEffect(() => {
    latestFormat.current = format;
  });

  useLayoutEffect(() => {
    const node = element.current;
    if (!node) return;

    if (reduceMotion) {
      shown.current = value;
      node.textContent = latestFormat.current(value);
      return;
    }

    // Start from what is on screen, before the browser paints the new value.
    node.textContent = latestFormat.current(shown.current);
    const controls = animate(shown.current, value, {
      duration: DURATION_SECONDS,
      ease: "easeOut",
      onUpdate: (latest) => {
        shown.current = latest;
        node.textContent = latestFormat.current(latest);
      },
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <span ref={element}>{format(value)}</span>;
};
