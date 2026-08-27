import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";
import { FeaturePageHero } from "@/components/site/FeaturePageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PodGallery } from "@/components/site/PodGallery";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getContent, type ContentBlock, type GalleryImage } from "@/lib/db";
import { getGalleryWithFallback } from "@/lib/gallery";
import { fallbackContent } from "@/data/content";
import { roseHotTubPhotos, thistleHotTubPhotos, saunaPhotos } from "@/data/media";
import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hot Tub & Sauna",
  description:
    "Both pods at Ballagan Farm have their own hot tub, set up differently — the Rose Pod's open to the sky, the Thistle Pod's under a covered gazebo with its own sauna.",
  alternates: { canonical: "/hot-tub-sauna" },
};

function toPhotos(images: GalleryImage[]): Photo[] {
  return images.map((image) => ({ src: image.url, alt: image.alt }));
}

function Point({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-loch-800/80">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-1 shrink-0 text-lamp-500">
        <path d="M2 7.5l3.2 3.2L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </li>
  );
}

export default async function HotTubSaunaPage() {
  const [content, roseHotTubImages, thistleHotTubImages, saunaImages] = await Promise.all([
    getContent().catch(() => ({}) as Record<string, ContentBlock>),
    getGalleryWithFallback("rose hot tub"),
    getGalleryWithFallback("thistle hot tub"),
    getGalleryWithFallback("sauna"),
  ]);

  const fromDb = content.extras;
  const fallback = fallbackContent.extras;
  const heading = fromDb?.heading || fallback.heading;
  const body = fromDb?.body || fallback.body;
  const heroImage = fromDb?.image_url ?? thistleHotTubPhotos[0].src;

  const rosePhotos = roseHotTubImages.length > 0 ? toPhotos(roseHotTubImages) : roseHotTubPhotos;
  const thistlePhotos = [
    ...(thistleHotTubImages.length > 0 ? toPhotos(thistleHotTubImages) : thistleHotTubPhotos),
    ...(saunaImages.length > 0 ? toPhotos(saunaImages) : saunaPhotos),
  ];

  return (
    <>
      <Header />

      <main id="main">
        <FeaturePageHero
          eyebrow="Outside every pod"
          title={heading}
          body={body}
          imageUrl={heroImage}
          imageAlt="The Thistle Pod's hot tub, bubbling under its covered gazebo"
        />

        {(
          [
            {
              slug: "rose",
              name: "Rose",
              eyebrow: "The Rose Pod's hot tub",
              heading: "Open to the sky",
              intro:
                "Right out on the Rose Pod's own decking, with an umbrella and a chiminea alongside — up to temperature and ready before you arrive.",
              points: [
                "Private hot tub, open to the sky",
                "Ready and up to temperature on arrival",
                "Umbrella and chiminea on the same decking",
                "Towels and robes provided",
              ],
              photos: rosePhotos,
              dark: false,
            },
            {
              slug: "thistle",
              name: "Thistle",
              eyebrow: "The Thistle Pod's hot tub & sauna",
              heading: "Under a covered gazebo",
              intro:
                "Sheltered under its own gazebo, with rattan seating alongside — plus sole access to our Scandinavian barrel sauna, both exclusive to the Thistle Pod.",
              points: [
                "Private hot tub under a covered gazebo",
                "Exclusive access to the barrel sauna",
                "Ready and up to temperature on arrival",
                "Towels and robes provided",
              ],
              photos: thistlePhotos,
              dark: true,
            },
          ] as const
        ).map((section) => (
          <section
            key={section.slug}
            className={cn("py-20 sm:py-28", section.dark ? "on-dark bg-loch-900" : "bg-oat-50")}
          >
            <div className="container-page">
              <SectionHeading
                eyebrow={section.eyebrow}
                title={section.heading}
                intro={section.intro}
                tone={section.dark ? "light" : "dark"}
              />

              <Reveal delay={0.1}>
                <ul className="mt-8 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
                  {section.points.map((point) => (
                    <Point key={point}>{point}</Point>
                  ))}
                </ul>
              </Reveal>

              <div className="mt-12">
                <PodGallery photos={section.photos} />
              </div>

              <Reveal delay={0.15} className="mt-10">
                <ButtonLink
                  href={`/pods/${section.slug}`}
                  variant={section.dark ? "light" : "outline"}
                >
                  See the {section.name} Pod
                </ButtonLink>
              </Reveal>
            </div>
          </section>
        ))}

        <Contact
          heading="Ask about the hot tubs"
          body="Questions about either tub, the sauna, or getting the timing right for your arrival? Send us a note and we'll get straight back to you."
        />
      </main>

      <Footer />
    </>
  );
}
