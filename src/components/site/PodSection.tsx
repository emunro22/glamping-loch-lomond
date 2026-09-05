import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PodGallery } from "./PodGallery";
import { cn } from "@/lib/utils";
import type { Photo } from "@/data/media";

type Props = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  photos: Photo[];
  points?: string[];
  footnote?: string;
  tone?: "oat" | "loch";
};

/** A photo-first section used on the pod detail pages: heading, points, then a gallery grid. */
export function PodSection({
  id,
  eyebrow,
  heading,
  body,
  photos,
  points,
  footnote,
  tone = "oat",
}: Props) {
  const dark = tone === "loch";

  return (
    <section
      id={id}
      className={cn("py-20 sm:py-28", dark ? "on-dark bg-loch-900" : "bg-oat-50")}
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          intro={body}
          tone={dark ? "light" : "dark"}
        />

        {points?.length ? (
          <Reveal delay={0.1}>
            <ul className="mt-8 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
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

        <div className="mt-12">
          <PodGallery photos={photos} />
        </div>

        {footnote ? (
          <Reveal delay={0.1}>
            <p
              className={cn(
                "mt-8 max-w-2xl border-l-2 border-lamp-500/50 pl-4 text-sm italic",
                dark ? "text-oat-100/60" : "text-loch-800/60",
              )}
            >
              {footnote}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
