import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("./motionFeatures").then((module) => module.default);

/**
 * Animation setup for a whole layout. Features load lazily, and people who
 * asked their system for less motion get no sliding or scaling.
 * Inside, use the `m` components (`motion/react-m`), never `motion`.
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  </MotionConfig>
);
