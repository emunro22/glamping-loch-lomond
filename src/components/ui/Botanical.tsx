"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PodTheme } from "@/data/site";

type Props = {
  variant: PodTheme;
  className?: string;
  animate?: boolean;
};

/**
 * The signature mark of the site: each pod is named after a flower, so each
 * pod gets its flower drawn as a single continuous line. The stroke draws
 * itself in on scroll, which is the only place on the page we spend motion
 * that isn't a fade.
 */
export function Botanical({ variant, className, animate = true }: Props) {
  const reduce = useReducedMotion();
  const shouldDraw = animate && !reduce;

  const paths = variant === "rose" ? rosePaths : thistlePaths;

  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth="1.4"
          initial={shouldDraw ? { pathLength: 0, opacity: 0 } : false}
          whileInView={shouldDraw ? { pathLength: 1, opacity: 1 } : undefined}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 1.6,
            delay: i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}

const rosePaths = [
  // bloom — spiralling petals
  "M60 52c-9 0-16-6-16-14s7-14 16-14 17 6 17 14c0 10-9 17-19 17-13 0-23-9-23-21S46 14 60 14s26 10 26 24-11 26-26 26",
  // outer petal sweep
  "M34 40c-4 8-3 18 3 25M86 40c4 8 3 18-3 25",
  // stem
  "M60 66v120",
  // left leaf
  "M60 104c-12-2-22-11-24-24 14-1 25 8 24 24Z",
  // right leaf
  "M60 138c12-2 22-11 24-24-14-1-25 8-24 24Z",
  // thorn detail
  "M60 88l-8-5M60 122l8-5",
];

const thistlePaths = [
  // spiky crown
  "M60 12v34M46 18l6 28M74 18l-6 28M36 30l12 20M84 30l-12 20M30 46l16 12M90 46l-16 12",
  // bulb
  "M44 50c0 14 7 22 16 22s16-8 16-22c0-8-7-13-16-13s-16 5-16 13Z",
  // bulb cross-hatch
  "M44 58h32M47 66h26",
  // stem
  "M60 72v114",
  // left leaf
  "M60 112c-14 0-24-10-26-24 15-2 27 8 26 24Z",
  // right leaf
  "M60 146c14 0 24-10 26-24-15-2-27 8-26 24Z",
];
