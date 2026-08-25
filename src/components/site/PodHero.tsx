import Image from "next/image";
import Link from "next/link";
import { BookingPanel } from "./BookingPanel";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { PodRecord } from "@/lib/db";
import type { AvailabilitySummary } from "@/lib/availability";

export function PodHero({
  pod,
  availability,
}: {
  pod: PodRecord;
  availability?: AvailabilitySummary | null;
}) {
  const isRose = pod.slug === "rose";

  return (
    <section className="relative isolate overflow-hidden bg-dusk pt-20">
      {pod.hero_image ? (
        <Image
          src={pod.hero_image}
          alt={pod.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-loch-950/70 via-loch-900/80 to-loch-900" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 h-[32rem] w-[32rem] rounded-full bg-lamp-500/15 blur-[120px]"
      />

      <div className="grain relative">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
          <div className="on-dark">
            <Reveal>
              <Link
                href="/#pods"
                className="eyebrow inline-flex items-center gap-2 text-lamp-400 transition-colors hover:text-lamp-300"
              >
                ← All pods
              </Link>
            </Reveal>

            <Reveal delay={0.08}>
              <p
                className={cn(
                  "eyebrow mt-6",
                  isRose ? "text-rose-300" : "text-thistle-300",
                )}
              >
                {pod.tagline}
              </p>
              <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-oat-50 sm:text-5xl md:text-6xl">
                {pod.name}
              </h1>
              <AvailabilityBadge summary={availability} tone="dark" className="mt-4" />
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-oat-100/75">
                {pod.description}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-oat-100/70">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-lamp-500" />
                  Sleeps {pod.sleeps}
                </li>
                {pod.price_from ? (
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-lamp-500" />
                    From {pod.price_from}
                  </li>
                ) : null}
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-lamp-500" />
                  En-suite with walk-in shower
                </li>
                {isRose ? (
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-lamp-500" />
                    BBQ hut available
                  </li>
                ) : (
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-lamp-500" />
                    Own hot tub &amp; sauna
                  </li>
                )}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <BookingPanel tone="dark" initialPod={pod.slug} />
          </Reveal>
        </div>
      </div>

      <div className="h-16 bg-gradient-to-b from-transparent to-oat-50" />
    </section>
  );
}
