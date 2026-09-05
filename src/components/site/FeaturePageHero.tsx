import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

/** A simpler dark hero for the standalone feature pages (BBQ hut, the view, etc.), with no booking panel. */
export function FeaturePageHero({ eyebrow, title, body, imageUrl, imageAlt = "" }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-dusk pt-20">
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 h-[32rem] w-[32rem] rounded-full bg-lamp-500/15 blur-[120px]"
      />

      <div className="grain relative">
        <div className="container-page py-20 lg:py-28">
          <div className="on-dark max-w-2xl">
            <Reveal>
              <Link
                href="/"
                className="eyebrow inline-flex items-center gap-2 text-lamp-400 transition-colors hover:text-lamp-300"
              >
                ← Back home
              </Link>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="eyebrow mt-6 text-lamp-400">{eyebrow}</p>
              <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-oat-50 sm:text-5xl md:text-6xl">
                {title}
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 text-lg leading-relaxed text-oat-100/75">{body}</p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="h-16 bg-gradient-to-b from-transparent to-oat-50" />
    </section>
  );
}
