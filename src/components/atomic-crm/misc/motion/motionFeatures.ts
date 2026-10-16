import { domMax } from "motion/react";

// Kept in its own module so LazyMotion can load it on demand, outside the
// main bundle. `domMax` is the bundle that includes layout animations.
export default domMax;
