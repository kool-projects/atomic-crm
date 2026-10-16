import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ComponentProps } from "react";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

/** A list whose rows slide in one after the other. */
export const StaggerList = (props: ComponentProps<typeof m.ul>) => (
  <m.ul variants={listVariants} initial="hidden" animate="show" {...props} />
);

export const StaggerItem = (props: ComponentProps<typeof m.li>) => (
  <m.li variants={itemVariants} {...props} />
);
