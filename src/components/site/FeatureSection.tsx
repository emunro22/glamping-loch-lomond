import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  points?: string[];
  imageUrl?: string | null;
  imageAlt?: string;
  flip?: boolean;
  tone?: "oat" | "loch";
  footnote?: string;
  moreHref?: string;
  moreLabel?: string;
};

export function FeatureSection({
  id,
  eyebrow,
  heading,
  body,
  points,
  imageUrl,
  imageAlt = "",
  flip = false,
  tone = "oat",
  footnote,
  moreHref,
  moreLabel = "Read more",
}: Props) {
  const dark = tone === "loch";

  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-28",
        dark ? "on-dark bg-loch-900" : "bg-oat-50",
      )}
    >
      <div
        className={cn(
          "container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        )}
      >
        <Reveal
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-[2rem]",
            dark ? "bg-loch-800" : "bg-oat-200",
            flip && "lg:order-2",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          ) : (
            <div
              className={cn(
                "grid h-full place-items-center text-sm",
                dark ? "text-oat-100/30" : "text-loch-800/30",
              )}
            >
              Add a photo in the admin portal
            </div>
          )}
          {/* Warm inner edge so photos sit in the palette rather than fight it */}
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-loch-950/10" />
        </Reveal>

        <div className={cn(flip && "lg:order-1")}>
          <Reveal delay={0.1}>
            <p
              className={cn(
                "eyebrow mb-4",
                dark ? "text-lamp-400" : "text-lamp-600",
              )}
            >
              {eyebrow}
            </p>
            <h2
              className={cn(
                "text-balance text-3xl leading-[1.1] sm:text-4xl md:text-[2.75rem]",
                dark ? "text-oat-50" : "text-loch-900",
              )}
            >
              {heading}
            </h2>
            <p
              className={cn(
                "mt-5 text-lg leading-relaxed",
                dark ? "text-oat-100/75" : "text-loch-800/75",
              )}
            >
              {body}
            </p>
          </Reveal>

          {points?.length ? (
            <Reveal delay={0.2}>
              <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {points.map((point) => (
                  <li
                    key={point}
                    className={cn(
                      "flex items-start gap-3 text-sm leading-relaxed",
                      dark ? "text-oat-100/80" : "text-loch-800/80",
                    )}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-lamp-500"
                    >
                      <path
                        d="M2 7.5l3.2 3.2L12 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {footnote ? (
            <Reveal delay={0.25}>
              <p
                className={cn(
                  "mt-8 border-l-2 border-lamp-500/50 pl-4 text-sm italic",
                  dark ? "text-oat-100/60" : "text-loch-800/60",
                )}
              >
                {footnote}
              </p>
            </Reveal>
          ) : null}

          {moreHref ? (
            <Reveal delay={0.3}>
              <Link
                href={moreHref}
                className={cn(
                  "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
                  dark ? "text-lamp-400 hover:text-lamp-300" : "text-lamp-600 hover:text-lamp-500",
                )}
              >
                {moreLabel}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
