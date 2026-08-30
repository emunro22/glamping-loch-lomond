"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BookingPanel } from "./BookingPanel";

type Props = {
  heading: string;
  body: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  heading,
  body,
  imageUrl,
  imageAlt = "Glamping pods at Ballagan Farm, Loch Lomond",
}: Props) {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease },
        };

  return (
    <section id="book" className="relative isolate overflow-hidden bg-dusk pt-20">
      {/* Photograph sits behind a dusk wash so the type stays readable */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-loch-950/70 via-loch-900/80 to-loch-900" />

      {/* Lamplight bloom — the warm window glow that gives the dusk its cosy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 h-[32rem] w-[32rem] rounded-full bg-lamp-500/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-loch-500/20 blur-[100px]"
      />

      <div className="grain relative">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
          <div className="on-dark">
            <motion.p {...rise(0.05)} className="eyebrow text-lamp-400">
              Ballagan Farm · Gartocharn · Loch Lomond
            </motion.p>

            <motion.h1
              {...rise(0.15)}
              className="mt-6 text-balance font-display text-4xl leading-[1.05] text-oat-50 sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            >
              {heading}
            </motion.h1>

            <motion.p
              {...rise(0.25)}
              className="mt-6 max-w-xl text-lg leading-relaxed text-oat-100/75"
            >
              {body}
            </motion.p>

            <motion.ul
              {...rise(0.35)}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {[
                "Sleeps 4",
                "En-suite shower",
                "Dog friendly",
                "BBQ hut available",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-oat-100/70"
                >
                  <span className="h-1 w-1 rounded-full bg-lamp-500" />
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div {...rise(0.45)} className="mt-10 lg:hidden">
              <a
                href="#pods"
                className="text-sm text-oat-100/60 underline underline-offset-4 hover:text-oat-50"
              >
                Look around the pods first
              </a>
            </motion.div>
          </div>

          <motion.div {...rise(0.4)}>
            <BookingPanel tone="dark" />
          </motion.div>
        </div>
      </div>

      {/* Soft transition into the oat body of the page */}
      <div className="h-16 bg-gradient-to-b from-transparent to-oat-50" />
    </section>
  );
}
