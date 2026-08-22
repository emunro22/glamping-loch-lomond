import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Botanical } from "@/components/ui/Botanical";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { buildBookingUrl, defaultStay } from "@/lib/booking";
import { cn } from "@/lib/utils";
import type { PodRecord } from "@/lib/db";
import type { AvailabilitySummary } from "@/lib/availability";

type Props = {
  pods: PodRecord[];
  availability?: Record<string, AvailabilitySummary> | null;
};

const themes = {
  rose: {
    text: "text-rose-700",
    ring: "ring-rose-300/60",
    tint: "bg-rose-300/12",
    dot: "bg-rose-500",
    mark: "text-rose-500/70",
  },
  thistle: {
    text: "text-thistle-700",
    ring: "ring-thistle-300/60",
    tint: "bg-thistle-300/12",
    dot: "bg-thistle-500",
    mark: "text-thistle-500/70",
  },
} as const;

export function PodShowcase({ pods, availability }: Props) {
  const stay = defaultStay();

  return (
    <section id="pods" className="relative bg-oat-100 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Two pods, two personalities"
          title="Pick your pod"
          intro="Both sleep four with the same kit inside. The difference is what sits outside the door."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {pods.map((pod, index) => {
            const theme =
              themes[(pod.slug as keyof typeof themes) in themes
                ? (pod.slug as keyof typeof themes)
                : "rose"];
            const features = Array.isArray(pod.features) ? pod.features : [];

            return (
              <Reveal
                key={pod.id}
                as="article"
                delay={index * 0.12}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-[2rem] bg-oat-50 ring-1 transition-shadow duration-500 hover:shadow-lift",
                  theme.ring,
                )}
              >
                <Link
                  href={`/pods/${pod.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-oat-200"
                >
                  {pod.hero_image ? (
                    <Image
                      src={pod.hero_image}
                      alt={pod.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className={cn("h-full w-full", theme.tint)} />
                  )}

                  {/* The flower the pod is named after, drawn over the photo */}
                  <Botanical
                    variant={pod.slug === "thistle" ? "thistle" : "rose"}
                    className={cn(
                      "absolute -right-2 top-4 h-40 w-24 opacity-90 mix-blend-luminosity",
                      theme.mark,
                    )}
                  />
                </Link>

                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <p className={cn("eyebrow", theme.text)}>{pod.tagline}</p>
                    <AvailabilityBadge summary={availability?.[pod.slug]} />
                  </div>
                  <Link href={`/pods/${pod.slug}`} className="group/title inline-block">
                    <h3 className="mt-3 text-2xl transition-colors sm:text-3xl group-hover/title:underline">
                      {pod.name}
                    </h3>
                  </Link>

                  <p className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-loch-800/75">
                    {pod.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-loch-800/80"
                      >
                        <span
                          className={cn(
                            "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full",
                            theme.dot,
                          )}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href={buildBookingUrl({
                        bookableId: pod.bookable_id,
                        rateTypeId: pod.rate_type_id,
                        startDate: stay.start,
                        endDate: stay.end,
                        occupancy: { adults: 2 },
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-loch-900 px-6 py-3 text-sm font-semibold text-oat-50 transition-colors hover:bg-loch-700"
                    >
                      Book {pod.name.replace("The ", "")}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                    <Link
                      href={`/pods/${pod.slug}`}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
                        theme.text,
                      )}
                    >
                      See inside
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <span className="w-full text-sm text-loch-800/55">
                      Sleeps {pod.sleeps}
                      {pod.price_from ? ` · from ${pod.price_from}` : ""}
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
