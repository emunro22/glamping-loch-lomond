"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { pods } from "@/data/site";
import {
  addDays,
  buildBookingUrl,
  defaultStay,
  nightsBetween,
  toISODate,
} from "@/lib/booking";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  tone?: "dark" | "light";
  initialPod?: string;
};

const fieldBase =
  "w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors";

export function BookingPanel({ className, tone = "dark", initialPod }: Props) {
  const stay = defaultStay();
  const today = toISODate(new Date());

  const [podSlug, setPodSlug] = useState(initialPod ?? pods[0].slug);
  const [start, setStart] = useState(stay.start);
  const [end, setEnd] = useState(stay.end);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [dogs, setDogs] = useState(0);

  const pod = pods.find((p) => p.slug === podSlug) ?? pods[0];
  const nights = nightsBetween(start, end);
  const invalid = nights < 1;

  const href = useMemo(
    () =>
      buildBookingUrl({
        bookableId: pod.bookableId,
        rateTypeId: pod.rateTypeId,
        startDate: start,
        endDate: invalid ? toISODate(addDays(new Date(`${start}T00:00:00`), 1)) : end,
        occupancy: { adults, children, infants, dogs },
      }),
    [pod, start, end, adults, children, infants, dogs, invalid],
  );

  // Keep checkout after check-in without fighting the user.
  function onStartChange(value: string) {
    setStart(value);
    if (nightsBetween(value, end) < 1) {
      setEnd(toISODate(addDays(new Date(`${value}T00:00:00`), 1)));
    }
  }

  const isLight = tone === "light";

  const labelClass = cn(
    "eyebrow mb-2 block",
    isLight ? "text-loch-800/55" : "text-oat-100/50",
  );

  const inputClass = cn(
    fieldBase,
    isLight
      ? "border-loch-900/15 text-loch-900 focus:border-lamp-600 [color-scheme:light]"
      : "border-oat-50/20 text-oat-50 focus:border-lamp-400 [color-scheme:dark]",
  );

  return (
    <div
      className={cn(
        "rounded-3xl border p-5 backdrop-blur-md sm:p-6",
        isLight
          ? "border-loch-900/10 bg-oat-100/80 shadow-lift"
          : "border-oat-50/15 bg-loch-950/55 shadow-lift",
        !isLight && "on-dark",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p
          className={cn(
            "eyebrow",
            isLight ? "text-lamp-600" : "text-lamp-400",
          )}
        >
          Check availability
        </p>
        <p
          className={cn(
            "text-xs",
            isLight ? "text-loch-800/60" : "text-oat-100/55",
          )}
        >
          {invalid
            ? "Checkout must be after check-in"
            : `${nights} night${nights === 1 ? "" : "s"} · ${pod.name}`}
        </p>
      </div>

      {/* Pod switch: two options, so a segmented control beats a dropdown */}
      <div
        className={cn(
          "mb-5 grid grid-cols-2 gap-1 rounded-2xl p-1",
          isLight ? "bg-loch-900/5" : "bg-oat-50/5",
        )}
        role="radiogroup"
        aria-label="Choose a pod"
      >
        {pods.map((p) => {
          const active = p.slug === podSlug;
          return (
            <button
              key={p.slug}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPodSlug(p.slug)}
              className={cn(
                "relative rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? isLight
                    ? "text-loch-950"
                    : "text-loch-950"
                  : isLight
                    ? "text-loch-800/60 hover:text-loch-900"
                    : "text-oat-100/60 hover:text-oat-50",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`pod-pill-${tone}`}
                  className={cn(
                    "absolute inset-0 rounded-xl",
                    p.slug === "rose" ? "bg-rose-300" : "bg-thistle-300",
                  )}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span className="relative">{p.name.replace("The ", "")}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="checkin">
            Check in
          </label>
          <input
            id="checkin"
            type="date"
            value={start}
            min={today}
            onChange={(e) => onStartChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="checkout">
            Check out
          </label>
          <input
            id="checkout"
            type="date"
            value={end}
            min={toISODate(addDays(new Date(`${start}T00:00:00`), 1))}
            onChange={(e) => setEnd(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Counter label="Adults" value={adults} min={1} max={4} onChange={setAdults} tone={tone} />
        <Counter label="Children" value={children} min={0} max={4} onChange={setChildren} tone={tone} />
        <Counter label="Infants" value={infants} min={0} max={2} onChange={setInfants} tone={tone} />
        <Counter label="Dogs" value={dogs} min={0} max={2} onChange={setDogs} tone={tone} />
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-lamp-500 px-6 py-4 text-base font-semibold text-loch-950 transition-all hover:bg-lamp-400 hover:shadow-glow active:scale-[0.99]"
      >
        See prices for these dates
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <p
        className={cn(
          "mt-3 text-center text-xs",
          isLight ? "text-loch-800/55" : "text-oat-100/50",
        )}
      >
        Opens our secure booking system. No booking fee.
      </p>
    </div>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
  tone,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  tone: "dark" | "light";
}) {
  const isLight = tone === "light";
  return (
    <div>
      <span
        className={cn(
          "eyebrow mb-2 block",
          isLight ? "text-loch-800/55" : "text-oat-100/50",
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border px-2 py-1.5",
          isLight ? "border-loch-900/15" : "border-oat-50/20",
        )}
      >
        <StepButton
          tone={tone}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          −
        </StepButton>
        <span
          className={cn(
            "min-w-[1.5rem] text-center text-sm font-semibold tabular-nums",
            isLight ? "text-loch-900" : "text-oat-50",
          )}
        >
          {value}
        </span>
        <StepButton
          tone={tone}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`More ${label.toLowerCase()}`}
        >
          +
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  children,
  tone,
  ...props
}: React.ComponentProps<"button"> & { tone: "dark" | "light" }) {
  const isLight = tone === "light";
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-lg text-base leading-none transition-colors disabled:opacity-30",
        isLight
          ? "text-loch-900 hover:bg-loch-900/10"
          : "text-oat-50 hover:bg-oat-50/10",
      )}
    >
      {children}
    </button>
  );
}
